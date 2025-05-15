import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from '../components/toast/toast.service';
import {LoaderService} from '../components/loader/loader.service';
import {State} from './base-state';
import {PaginationState} from './base-pagination-state';

@Injectable({
  providedIn: 'root'
})
export class BaseRequestService {

  toasterService = inject(ToastService);
  loaderService = inject(LoaderService);


  executeRequest<T>({
                                      state,
                                      request,
                                      onLoading,
                                      onSuccess,
                                      onFailed,
                                      handleSuccess = false,
                                      handleError = true,
                                      successMessage,
                                      errorMessage,
                                      showLoader = false
                                    }: {
    state: State<T> | PaginationState<T>;
    request: Observable<T> | Promise<T>;
    onLoading?: () => void,
    onSuccess?: (response: T) => void;
    onFailed?: (error: HttpErrorResponse) => void;
    handleSuccess?: boolean,
    handleError?: boolean,
    successMessage?: string;
    errorMessage?: string;
    showLoader?: boolean
  }): void {

    /**
     * Observable Handler
     */

    if (successMessage) {
      handleSuccess = true;
    }

    if (this.isObservable(request)) {
      if (onLoading != null) {
        onLoading();
      }

      if (showLoader) {
        this.loaderService.show();
      }
      state.notifyLoading();

      request?.subscribe({
        next: (res: any) => {
          let messageToShow = res?.successMessage;

          if (successMessage != null) {
            messageToShow = successMessage;
          }
          if (handleSuccess) {
            this.toasterService.success(messageToShow ?? 'Request successful');
          }
          state.notifySuccess(res);
          if (onSuccess != null) {
            onSuccess(res);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (handleError) {
            const errorMessages = err?.error?.errorMessages ?? [];
            let error = 'Unknown error, please contact administrator.';
            if (errorMessages.length > 0) {
              error = errorMessages[0];
            }
            this.toasterService.error(error);
          }
          if (showLoader) {
            this.loaderService.hide();
          }
          state.notifyError(err.error);
          if (onFailed != null) {
            onFailed(err);
          }
        },
        complete: () => {
          if (showLoader) {
            this.loaderService.hide();
          }
        },
      });

    }


    /**
     * Promise Handler
     */
    if (this.isPromise(request)) {
      if (onLoading != null) {
        onLoading();
      }

      if (showLoader) {
        this.loaderService.show();
      }
      state.notifyLoading();

      request.then((value) => {
        if (handleSuccess) {
          this.toasterService.success(successMessage ?? 'Request successful');
        }

        state.notifySuccess(value);
        if (onSuccess != null) {
          onSuccess(value);
        }
      }).catch((error) => {
        if (handleError) {
          this.toasterService.error(errorMessage ?? error ?? 'Unknown error, please contact administrator.');
        }
        state.notifyError(error);
        if (onFailed != null) {
          onFailed(error);
        }
      }).finally(() => {
        if (showLoader) {
          this.loaderService.hide();
        }
      });
    }
  }

  isObservable<T>(input: any): input is Observable<T> {
    return input && typeof input.subscribe === 'function';
  }


  isPromise<T>(input: any): input is Promise<T> {
    return input && typeof input.then === 'function';
  }
}
