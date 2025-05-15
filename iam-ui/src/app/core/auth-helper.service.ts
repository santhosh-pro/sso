import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
const accessTokenKey = 'accessToken';
const userKey = 'user';
@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  isUserLogged$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.isUserLogged$.next(!!localStorage.getItem(accessTokenKey));
  }

  async storePreference(
    accessToken: string,
    userDetail?: {
      username: string;
      name: string;
    }
  ): Promise<void> {
    localStorage.setItem(accessTokenKey, accessToken);
    localStorage.setItem(userKey, JSON.stringify(userDetail));
    this.isUserLogged$.next(true);
  }

  isUserLogged(): boolean {
    return localStorage.getItem(accessTokenKey) ? true : false;
  }

  getAccessToken(): string {
    return localStorage.getItem(accessTokenKey) ?? '';
  }

  getUserDetail() {
    return JSON.parse(localStorage.getItem(userKey) || '{}');
  }


  removePreference(): void {
    localStorage.removeItem(accessTokenKey);
    this.isUserLogged$.next(false);
  }

}