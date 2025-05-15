import {inject, Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpRequest, HttpParams} from '@angular/common/http';
import {Observable, retry, Subject, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {NGL_CONFIG} from '../ngl-config.token';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  config = inject(NGL_CONFIG);

  protected defaultHeaders: HttpHeaders;
  protected baseUrl: string = this.config.baseApiUrl;

  private http = inject(HttpClient);

  constructor() {
    this.defaultHeaders = new HttpHeaders();
  }

  setDefaultHeaders(headers: HttpHeaders) {
    this.defaultHeaders = headers;
  }

  // Set the base URL
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected get<T>(
    url: string,
    queryParams?: { [key: string]: any },
    customHeaders?: HttpHeaders,
    useCache: boolean = false,
    cacheDurationMinutes: number = 0
  ) {
    const headers = this.mergeHeaders(customHeaders);

    // Set cache-related headers
    if (useCache) {
      const cacheDurationSeconds = cacheDurationMinutes * 60; // Convert minutes to seconds
      headers.set('Cache-Control', `max-age=${cacheDurationSeconds}`);
    } else {
      headers.set('Cache-Control', 'no-cache');
    }

    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      url += `?${queryString}`;
    }

    const options = {headers};
    return this.http.get<T>(this.getFullUrl(url), options).pipe(
      map((data: any) => this.transformResponse(data)),
      catchError(this.handleHttpError)
    );
  }

  protected fromFile<T>(url: string) {
    return this.http.get<T>(url);
  }


  protected getWithRetry<T>(
    url: string,
    customHeaders?: HttpHeaders,
    useCache: boolean = false,
    cacheDurationMinutes: number = 0,
    maxRetries: number = 0, // Default retry count is 0
    retryDelayMs: number = 1000,
    enableRetry: boolean = false
  ) {
    const headers = this.mergeHeaders(customHeaders);

    // Set cache-related headers
    if (useCache) {
      const cacheDurationSeconds = cacheDurationMinutes * 60; // Convert minutes to seconds
      headers.set('Cache-Control', `max-age=${cacheDurationSeconds}`);
    } else {
      headers.set('Cache-Control', 'no-cache');
    }

    const options = {headers};

    return this.http.get<T>(this.getFullUrl(url), options).pipe(
      map((data: any) => this.transformResponse(data)),
      enableRetry && maxRetries > 0
        ? retry(maxRetries)
        : catchError(this.handleHttpError)
    );
  }

  protected post<T>(url: string,
                    body: any,
                    queryParams?: { [key: string]: any },
                    customHeaders?: HttpHeaders,) {
    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      url += `?${queryString}`;
    }
    const headers = this.mergeHeaders(customHeaders);
    return this.http.post<T>(this.getFullUrl(url), body, {headers}).pipe(
      map((data: any) => this.transformResponse(data)),
      catchError(this.handleHttpError)
    );
  }

  protected put<T>(url: string,
                   body: any,
                   queryParams?: { [key: string]: any },
                   customHeaders?: HttpHeaders,) {
    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      url += `?${queryString}`;
    }
    const headers = this.mergeHeaders(customHeaders);
    return this.http.put<T>(this.getFullUrl(url), body, {headers}).pipe(
      map((data: any) => this.transformResponse(data)),
      catchError(this.handleHttpError)
    );
  }

  protected delete<T>(url: string,
                      queryParams?: { [key: string]: any },
                      customHeaders?: HttpHeaders) {
    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      url += `?${queryString}`;
    }
    const headers = this.mergeHeaders(customHeaders);
    return this.http.delete<T>(this.getFullUrl(url), {headers}).pipe(
      map((data: any) => this.transformResponse(data)),
      catchError(this.handleHttpError)
    );
  }

  protected uploadFile(url: string, file: File, customHeaders?: HttpHeaders): Observable<HttpEvent<any>> {
    const headers = this.mergeHeaders(customHeaders);
    const formData = new FormData();
    formData.append('file', file, file.name);

    const request = new HttpRequest('POST', this.getFullUrl(url), formData, {
      headers,
      reportProgress: true
    });

    return this.http.request(request).pipe(
      catchError(this.handleHttpError)
    );
  }

  protected uploadFiles(url: string, files: FileList, customHeaders?: HttpHeaders): Observable<HttpEvent<any>> {
    const headers = this.mergeHeaders(customHeaders);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`file${i}`, files[i], files[i].name);
    }

    return this.http.post(this.getFullUrl(url), formData, {headers, reportProgress: true, observe: 'events'});
  }

  protected uploadFormData(url: string, formData: FormData, customHeaders?: HttpHeaders, cancelSubject?: Subject<void>): Observable<HttpEvent<any>> {
    const headers = this.mergeHeaders(customHeaders);

    return this.http.post(this.getFullUrl(url), formData, {headers, reportProgress: true, observe: 'events'});
  }

  protected transformResponse(data: any): any {
    // You can implement auth transformation logic here
    return data;
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  private mergeHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let mergedHeaders = this.defaultHeaders;

    if (customHeaders) {
      customHeaders.keys().forEach(key => {
        mergedHeaders = mergedHeaders.set(key, customHeaders.get(key)!);
      });
    }

    return mergedHeaders;
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else {
      return this.baseUrl + url;
    }
  }
}
