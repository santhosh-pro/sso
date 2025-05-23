/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * API
 * 
  <h3>📌 Welcome to the <strong>IAM</strong> 🚀</h3>
  
 * OpenAPI spec version: 1.0
 */

export interface ConfigurationResponse {
  /** The URL of the OpenID Connect provider. */
  issuer: string;
  /** The URL to redirect users for authentication. */
  authorization_endpoint: string;
  /** The URL to exchange an authorization code for tokens. */
  token_endpoint: string;
  /** The URL to obtain user information. */
  userinfo_endpoint: string;
  /** The URL of the public keys used to verify JWT tokens. */
  jwks_uri: string;
  /** The supported response types in authorization requests. */
  response_types_supported: string[];
  /** The supported subject identifier types. */
  subject_types_supported: string[];
  /** The supported signing algorithms for ID tokens. */
  id_token_signing_alg_values_supported: string[];
  /** The authentication methods supported at the token endpoint. */
  token_endpoint_auth_methods_supported: string[];
  /** The supported OAuth 2.0 grant types. */
  grant_types_supported: string[];
  /** The supported scopes for the client. */
  scopes_supported: string[];
  /** The supported claims for the ID token. */
  claims_supported: string[];
  /** The supported methods for PKCE code challenges. */
  code_challenge_methods_supported: string[];
}
