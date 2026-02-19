import { Action } from "@reduxjs/toolkit";
import { IAuth } from "../models/auth/typing/auth.interface";
import { IUser } from "../models/user/typing/user.interface";

export interface IStore {
  user: IUser;
  authorization: IAuth;
}

export interface IAction<T> extends Action<string> {
  readonly type: string;
  readonly payload?: T;
  readonly error?: boolean;
  readonly meta?: any;
}
