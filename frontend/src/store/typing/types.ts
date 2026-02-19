import { Dispatch } from '@reduxjs/toolkit';
import { DispatchProp } from 'react-redux';
import { IAction, IStore } from './interface';

export type ReduxDispatch<P> = Dispatch<IAction<P>>;

export type ReduxDispatchProp<P> = DispatchProp<IAction<P>>;

export type TSelector<T> = (state: IStore) => T;

export type TUseDeepSelector = <T>(callback: (state: IStore) => T) => T;