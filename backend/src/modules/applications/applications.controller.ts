import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CreateApplicationInvestmentDto } from './dto/create-application-investment.dto';
import { UpdateApplicationInvestmentDto } from './dto/update-application-investment.dto';
import { memoryStorage } from 'multer';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() imageFile?: any,
  ) {
    return this.applicationsService.create(createApplicationDto, imageFile);
  }

  @Get('currencies')
  async findAllCurrencies() {
    return this.applicationsService.findAllCurrencies();
  }

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset, 10) : undefined;

    const result = await this.applicationsService.findAll(
      parsedLimit,
      parsedOffset,
    );
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.findOneView(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @UploadedFile() imageFile?: any,
  ) {
    return this.applicationsService.update(id, updateApplicationDto, imageFile);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.remove(id);
  }

  @Get(':id/investments')
  async getInvestments(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.getInvestments(id);
  }

  @Post(':id/investments')
  async addInvestment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createApplicationInvestmentDto: CreateApplicationInvestmentDto,
  ) {
    return this.applicationsService.addInvestment(
      id,
      createApplicationInvestmentDto,
    );
  }

  @Patch(':applicationId/investments/:investmentId')
  async updateInvestment(
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Body() updateApplicationInvestmentDto: UpdateApplicationInvestmentDto,
  ) {
    return this.applicationsService.updateInvestment(
      applicationId,
      investmentId,
      updateApplicationInvestmentDto,
    );
  }
}
