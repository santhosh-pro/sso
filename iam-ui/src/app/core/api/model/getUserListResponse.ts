/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * API
 * 
  <h3>📌 Welcome to the <strong>IAM</strong> 🚀</h3>
  
 * OpenAPI spec version: 1.0
 */
import type { GetUserListItem } from './getUserListItem';

export interface GetUserListResponse {
  successMessage: string;
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  orderByPropertyName: string;
  sortingDirection: string;
  data: GetUserListItem[];
}
