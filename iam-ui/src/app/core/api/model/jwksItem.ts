/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * API
 * 
  <h3>📌 Welcome to the <strong>IAM</strong> 🚀</h3>
  
 * OpenAPI spec version: 1.0
 */

export interface JwksItem {
  /** Key ID */
  kid: string;
  /** Key Type */
  kty: string;
  /** Algorithm */
  alg: string;
  /** Use case, e.g., signature */
  use: string;
  /** Modulus part of the key */
  n: string;
  /** Exponent part of the key */
  e: string;
}
