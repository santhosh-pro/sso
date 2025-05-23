import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../environments/environment.development";
import { firstValueFrom } from "rxjs";

interface TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
}

interface OIDCConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  issuer: string;
}

@Injectable({ providedIn: 'root' })
export class OAuthService {
  private accessToken: string | null = null;
  private oidcConfig: OIDCConfiguration | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  async initOAuthFlow(): Promise<void> {
    await this.loadOIDCConfig();

    const state = crypto.randomUUID();
    const codeVerifier = this.generateCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);

    try {
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      const authUrl = this.buildAuthorizationUrl(state, codeChallenge);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth flow:', error);
      throw new Error('Unable to start authentication process');
    }
  }

  async processOAuthCallback(): Promise<void> {
    try {
      const { code, state } = this.parseCallbackParams();
      const storedVerifier = localStorage.getItem('code_verifier');

      if (!code || !storedVerifier) {
        throw new Error('Missing authorization code or code verifier');
      }

      const tokenResponse = await this.exchangeCodeForToken(code, storedVerifier);
      this.storeTokens(tokenResponse);
      this.cleanupCallback();

      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
      await this.router.navigate(['/']);
      throw error;
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) {
      return this.accessToken;
    }

    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      this.accessToken = storedToken;
      return storedToken;
    }

    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  async logout(): Promise<void> {
    try {
      await this.loadOIDCConfig();
      
      if (this.oidcConfig && this.oidcConfig.end_session_endpoint) {
        const logoutUrl = this.oidcConfig.end_session_endpoint;
        
        const params = new HttpParams()
          .set('post_logout_redirect_uri', environment.oidc.logoutUri);
        
        await firstValueFrom(this.http.get(logoutUrl, {withCredentials:true, params }));

        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
        this.accessToken = null;

        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Logout failed:', error);

      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('refresh_token');
      this.accessToken = null;
      this.router.navigate(['/']);
    }
  }

  // async logout(): Promise<void> {
  //   try {
  //     await this.loadOIDCConfig();
  
  //     if (this.oidcConfig && this.oidcConfig.end_session_endpoint) {
  //       localStorage.removeItem('access_token');
  //       localStorage.removeItem('id_token');
  //       localStorage.removeItem('refresh_token');
  //       this.accessToken = null;
  
  //       const redirectUri = encodeURIComponent(environment.oidc.logoutUri);
  //       const logoutUrl = `${this.oidcConfig.end_session_endpoint}?post_logout_redirect_uri=${redirectUri}`;
  //       window.location.href = logoutUrl;
  //     }
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  
  //     localStorage.removeItem('access_token');
  //     localStorage.removeItem('id_token');
  //     localStorage.removeItem('refresh_token');
  //     this.accessToken = null;
  
  //     this.router.navigate(['/']);
  //   }
  // }
  

  private async loadOIDCConfig(): Promise<void> {
    if (this.oidcConfig) return;

    const configUrl = `${environment.oidc.issuer}/.well-known/openid-configuration`;
    this.oidcConfig = await firstValueFrom(this.http.get<OIDCConfiguration>(configUrl));
  }

  private buildAuthorizationUrl(state: string, codeChallenge: string): string {
    if (!this.oidcConfig) throw new Error('OIDC config not loaded');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: environment.oidc.clientId,
      redirect_uri: environment.oidc.redirectUri,
      scope: 'openid profile email',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${this.oidcConfig.authorization_endpoint}?${params.toString()}`;
  }

  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    await this.loadOIDCConfig();
    if (!this.oidcConfig) throw new Error('OIDC config not loaded');

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', environment.oidc.clientId)
      .set('code', code)
      .set('redirect_uri', environment.oidc.redirectUri)
      .set('code_verifier', codeVerifier);

    return firstValueFrom(
      this.http.post<TokenResponse>(this.oidcConfig.token_endpoint, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
  }

  private storeTokens(tokenResponse: TokenResponse): void {
    localStorage.setItem('access_token', tokenResponse.access_token);
    localStorage.setItem('id_token', tokenResponse.id_token);
    if (tokenResponse.refresh_token) {
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);
    }
    this.accessToken = tokenResponse.access_token;
  }

  private cleanupCallback(): void {
    localStorage.removeItem('code_verifier');
    history.replaceState(null, '', environment.oidc.redirectUri);
  }

  private parseCallbackParams(): { code: string | null; state: string | null } {
    const params = new URLSearchParams(window.location.search);
    return {
      code: params.get('code'),
      state: params.get('state'),
    };
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64urlEncode(new Uint8Array(hash));
  }

  private base64urlEncode(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
