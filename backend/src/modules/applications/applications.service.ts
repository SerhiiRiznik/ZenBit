import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateApplicationInvestmentDto } from './dto/create-application-investment.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationInvestmentDto } from './dto/update-application-investment.dto';
import {
  ApplicationInvestmentEntity,
  ApplicationInvestmentStatus,
} from './entities/application-investment.entity';
import { ApplicationEntity } from './entities/application.entity';
import { CurrencyEntity } from './entities/currency.entity';
import { UsersService } from '../users/users.service';
import { ApplicationImagesStorageService } from './application-images-storage.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationsRepository: Repository<ApplicationEntity>,
    @InjectRepository(CurrencyEntity)
    private readonly currenciesRepository: Repository<CurrencyEntity>,
    @InjectRepository(ApplicationInvestmentEntity)
    private readonly investmentsRepository: Repository<ApplicationInvestmentEntity>,
    private readonly usersService: UsersService,
    private readonly applicationImagesStorageService: ApplicationImagesStorageService,
  ) {}

  private async getCurrency(code: string): Promise<CurrencyEntity> {
    const normalizedCode = code.toUpperCase();
    const allCurrency = await this.findAllCurrencies();

    const existingCurrency = allCurrency.find(
      (curr) => curr.code.toUpperCase() === normalizedCode,
    );

    if (existingCurrency) {
      return existingCurrency;
    }

    throw new BadRequestException({
      message: `Currency '${normalizedCode}' not found`,
      availableCurrencies: allCurrency.map((currency) => currency.code),
    });
  }

  private calculateSoldPercent(offersAmount: number, soldOffersCount: number) {
    if (offersAmount <= 0) {
      return 0;
    }

    const rawPercent = (soldOffersCount / offersAmount) * 100;
    return Math.min(100, Number(rawPercent.toFixed(2)));
  }

  private async getApprovedCountsByApplicationIds(applicationIds: number[]) {
    if (applicationIds.length === 0) {
      return new Map<number, number>();
    }

    const approvedInvestments = await this.investmentsRepository
      .createQueryBuilder('investment')
      .select('investment.applicationId', 'applicationId')
      .addSelect('COUNT(*)', 'count')
      .where('investment.status = :status', {
        status: ApplicationInvestmentStatus.APPROVED,
      })
      .andWhere('investment.applicationId IN (:...applicationIds)', {
        applicationIds,
      })
      .groupBy('investment.applicationId')
      .getRawMany<{ applicationId: string; count: string }>();

    return approvedInvestments.reduce(
      (accumulator, item) =>
        accumulator.set(Number(item.applicationId), Number(item.count)),
      new Map<number, number>(),
    );
  }

  private async toApplicationView(application: ApplicationEntity) {
    const soldOffersByApplicationId =
      await this.getApprovedCountsByApplicationIds([application.id]);
    const soldOffersCount = soldOffersByApplicationId.get(application.id) ?? 0;

    return {
      id: application.id,
      title: application.title,
      imageUrl: application.imageUrl,
      targetAmount: application.priceAmount,
      ticketAmount: application.ticketAmount,
      validTo: application.validTo,
      yieldPercent: application.yieldPercent,
      soldPercent: this.calculateSoldPercent(
        application.offersAmount,
        soldOffersCount,
      ),
      currency: {
        id: application.currency.id,
        code: application.currency.code,
        symbol: application.currency.symbol,
        name: application.currency.name,
      },
    };
  }

  async findAllCurrencies() {
    const currencies = await this.currenciesRepository.find({
      select: {
        code: true,
        id: true,
        name: true,
        symbol: true,
      },
      order: { id: 'ASC' },
    });

    return currencies;
  }

  async findAll(limit?: number, offset?: number) {
    const options: any = {
      order: { createdAt: 'DESC' },
    };
    if (typeof limit === 'number') {
      options.take = limit;
    }
    if (typeof offset === 'number') {
      options.skip = offset;
    }
    const applications = await this.applicationsRepository.find(options);

    const soldOffersByApplicationId =
      await this.getApprovedCountsByApplicationIds(
        applications.map((application) => application.id),
      );

    return applications.map((application) => {
      const soldOffersCount =
        soldOffersByApplicationId.get(application.id) ?? 0;

      return {
        id: application.id,
        title: application.title,
        imageUrl: application.imageUrl,
        targetAmount: application.priceAmount,
        ticketAmount: application.ticketAmount,
        validTo: application.validTo,
        yieldPercent: application.yieldPercent,
        soldPercent: this.calculateSoldPercent(
          application.offersAmount,
          soldOffersCount,
        ),
        currency: {
          id: application.currency.id,
          code: application.currency.code,
          symbol: application.currency.symbol,
          name: application.currency.name,
        },
      };
    });
  }

  async findOne(id: number): Promise<ApplicationEntity> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return application;
  }

  async findOneView(id: number) {
    const application = await this.findOne(id);
    return this.toApplicationView(application);
  }

  async create(createApplicationDto: CreateApplicationDto, imageFile?: any) {
    const currency = await this.getCurrency(createApplicationDto.currencyCode);
    const normalizedTitle = createApplicationDto.title;

    if (!normalizedTitle) {
      throw new BadRequestException('title is required');
    }

    const uploadedImageUrl = imageFile
      ? await this.applicationImagesStorageService.uploadApplicationImage(
          imageFile,
        )
      : null;

    const application = this.applicationsRepository.create({
      title: createApplicationDto.title,
      imageUrl: uploadedImageUrl ?? createApplicationDto.imageUrl ?? null,
      priceAmount: createApplicationDto.priceAmount,
      ticketAmount: createApplicationDto.ticketAmount,
      offersAmount: createApplicationDto.offersAmount,
      validTo: new Date(createApplicationDto.validTo),
      yieldPercent: createApplicationDto.yieldPercent,
      currency,
    });

    const createdApplication =
      await this.applicationsRepository.save(application);
    return this.toApplicationView(createdApplication);
  }

  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    imageFile?: any,
  ) {
    const application = await this.findOne(id);

    if (updateApplicationDto.title !== undefined) {
      application.title = updateApplicationDto.title;
    }

    if (updateApplicationDto.imageUrl !== undefined) {
      application.imageUrl = updateApplicationDto.imageUrl;
    }

    if (imageFile) {
      application.imageUrl =
        await this.applicationImagesStorageService.uploadApplicationImage(
          imageFile,
        );
    }

    if (updateApplicationDto.priceAmount !== undefined) {
      application.priceAmount = updateApplicationDto.priceAmount;
    }

    if (updateApplicationDto.ticketAmount !== undefined) {
      application.ticketAmount = updateApplicationDto.ticketAmount;
    }

    if (updateApplicationDto.offersAmount !== undefined) {
      application.offersAmount = updateApplicationDto.offersAmount;
    }

    if (updateApplicationDto.validTo !== undefined) {
      application.validTo = new Date(updateApplicationDto.validTo);
    }

    if (updateApplicationDto.yieldPercent !== undefined) {
      application.yieldPercent = updateApplicationDto.yieldPercent;
    }

    if (updateApplicationDto.currencyCode) {
      application.currency = await this.getCurrency(
        updateApplicationDto.currencyCode,
      );
    }

    const updatedApplication =
      await this.applicationsRepository.save(application);
    return this.toApplicationView(updatedApplication);
  }

  async remove(id: number): Promise<{ success: true }> {
    const application = await this.findOne(id);
    await this.applicationsRepository.remove(application);
    return { success: true };
  }

  async getInvestments(applicationId: number) {
    await this.findOne(applicationId);

    const investments = await this.investmentsRepository.find({
      where: { application: { id: applicationId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });

    return investments.map((investment) => ({
      id: investment.id,
      status: investment.status,
      user: {
        id: investment.user.id,
        fullName: investment.user.fullName,
        email: investment.user.email,
      },
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    }));
  }

  async addInvestment(
    applicationId: number,
    createApplicationInvestmentDto: CreateApplicationInvestmentDto,
  ) {
    const application = await this.findOne(applicationId);
    const user = await this.usersService.findById(
      createApplicationInvestmentDto.userId,
    );

    if (!user) {
      throw new NotFoundException(
        `User with id ${createApplicationInvestmentDto.userId} not found`,
      );
    }

    const investment = this.investmentsRepository.create({
      application,
      user,
      status: createApplicationInvestmentDto.status,
    });

    return this.investmentsRepository.save(investment);
  }

  async updateInvestment(
    applicationId: number,
    investmentId: number,
    updateApplicationInvestmentDto: UpdateApplicationInvestmentDto,
  ) {
    await this.findOne(applicationId);

    const investment = await this.investmentsRepository.findOne({
      where: { id: investmentId, application: { id: applicationId } },
      relations: { application: true },
    });

    if (!investment) {
      throw new NotFoundException(
        `Investment with id ${investmentId} not found for application ${applicationId}`,
      );
    }

    Object.assign(investment, updateApplicationInvestmentDto);
    return this.investmentsRepository.save(investment);
  }
}
