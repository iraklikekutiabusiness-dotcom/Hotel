import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL, API_KEY } from '../../../core/config/api.config';
import { ApiResponse, Hotel, HotelFilters, PagedResult } from './hotel.models';

@Injectable({ providedIn: 'root' })
export class HotelApiService {
  private readonly http = inject(HttpClient);
  private readonly headers = { 'X-STEP-KEY': API_KEY };

  list(page = 1, take = 12): Observable<PagedResult<Hotel>> {
    const params = new HttpParams().set('Page', page).set('Take', take);
    return this.http.get<ApiResponse<PagedResult<Hotel>>>(`${API_BASE_URL}/api/hotels`, {
      headers: this.headers,
      params,
    }).pipe(map((response) => response.data));
  }

  search(query: string, page = 1, take = 12): Observable<PagedResult<Hotel>> {
    const params = new HttpParams().set('query', query).set('Page', page).set('Take', take);
    return this.http.get<ApiResponse<PagedResult<Hotel>>>(`${API_BASE_URL}/api/hotels/search`, {
      headers: this.headers,
      params,
    }).pipe(map((response) => response.data));
  }

  filter(filters: HotelFilters, page = 1, take = 12): Observable<PagedResult<Hotel>> {
    let params = new HttpParams().set('Page', page).set('Take', take);
    if (filters.search) params = params.set('Search', filters.search);
    if (filters.city) params = params.set('City', filters.city);
    if (filters.minStarRating) params = params.set('MinStarRating', filters.minStarRating);
    if (filters.maxStarRating) params = params.set('MaxStarRating', filters.maxStarRating);
    if (filters.sortBy) params = params.set('SortBy', filters.sortBy);
    if (filters.sortDescending !== undefined) params = params.set('SortDescending', filters.sortDescending);
    return this.http.get<ApiResponse<PagedResult<Hotel>>>(`${API_BASE_URL}/api/hotels/filter`, {
      headers: this.headers,
      params,
    }).pipe(map((response) => response.data));
  }
}
