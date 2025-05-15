import {signal} from "@angular/core";

export interface BaseStateImpl<T> {
  notifyLoading(): void;

  notifySuccess(data: T): void;

  notifyError(errorMsg: string): void;

  clearState(): void;
}

export class State<T> implements BaseStateImpl<T> {
  responseSignal = signal<T | null>(null);
  private initialLoadingSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);
  private successSignal = signal<boolean>(false);
  private failedSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private stateSignal = signal<RequestState | null>(null);

  readonly response = this.responseSignal.asReadonly();
  readonly initialLoading = this.initialLoadingSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();
  readonly failed = this.failedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly state = this.stateSignal.asReadonly();

  constructor() {
    this.stateSignal.set(RequestState.idle);
  }

  notifyInitialLoading() {
    this.responseSignal.set(null);
    this.initialLoadingSignal.set(true);
    this.loadingSignal.set(true);
    this.successSignal.set(false);
    this.failedSignal.set(false);
    this.errorSignal.set(null);
    this.stateSignal.set(RequestState.initialLoading);
  }

  notifyLoading() {
    // this.responseSignal.set(null);
    this.initialLoadingSignal.set(false);
    this.loadingSignal.set(true);
    this.successSignal.set(false);
    this.failedSignal.set(false);
    this.errorSignal.set(null);
    this.stateSignal.set(RequestState.loading);
  }

  notifySuccess(data: T) {
    this.responseSignal.set(data);
    this.initialLoadingSignal.set(false);
    this.loadingSignal.set(false);
    this.successSignal.set(true);
    this.failedSignal.set(false);
    this.errorSignal.set(null);
    this.stateSignal.set(RequestState.success);
  }

  notifyError(errorMsg: string) {
    this.responseSignal.set(null);
    this.initialLoadingSignal.set(false);
    this.loadingSignal.set(false);
    this.successSignal.set(false);
    this.failedSignal.set(true);
    this.errorSignal.set(errorMsg);
    this.stateSignal.set(RequestState.error);
  }

  clearState() {
    this.responseSignal.set(null);
    this.initialLoadingSignal.set(false);
    this.loadingSignal.set(false);
    this.successSignal.set(false);
    this.failedSignal.set(false);
    this.errorSignal.set(null);
    this.stateSignal.set(RequestState.idle);
  }
}

export enum RequestState {
  idle = 'idle',
  initialLoading = 'initialLoading',
  loading = 'loading',
  error = 'error',
  success = 'success'
}

// export class BaseState<T> implements BaseStateImpl<T> {
//   private dataSubject = new BehaviorSubject<T | null>(null);
//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   private errorSubject = new BehaviorSubject<string | null>(null);
//   private stateSubject = new BehaviorSubject<RequestState | null>(null);
//
//   auth$: Observable<T | null> = this.dataSubject.asObservable();
//   loading$: Observable<boolean> = this.loadingSubject.asObservable();
//   error$: Observable<string | null> = this.errorSubject.asObservable();
//   state$: Observable<RequestState | null> = this.stateSubject.asObservable();
//
//   constructor() {
//     this.stateSubject.next(RequestState.initial);
//   }
//
//   notifyLoading() {
//     this.loadingSubject.next(true);
//     this.dataSubject.next(null);
//     this.errorSubject.next(null);
//     this.stateSubject.next(RequestState.loading);
//   }
//
//   notifySuccess(auth: T) {
//     this.loadingSubject.next(false);
//     this.dataSubject.next(auth);
//     this.errorSubject.next(null);
//     this.stateSubject.next(RequestState.success);
//   }
//
//   notifyError(errorMsg: string) {
//     this.loadingSubject.next(false);
//     this.dataSubject.next(null);
//     this.errorSubject.next(errorMsg);
//     this.stateSubject.next(RequestState.error);
//   }
//
//   clearState() {
//     this.loadingSubject.next(false);
//     this.dataSubject.next(null);
//     this.errorSubject.next(null);
//     this.stateSubject.next(RequestState.initial);
//   }
// }


