export interface HotelAddress {
  city: string | null;
  country: string | null;
  street: string | null;
}

export interface Hotel {
  id: number;
  name: string;
  starRating: number;
  thumbnail: string | null;
  averageRating: number;
  reviewCount: number;
  roomCount: number;
  address: HotelAddress | null;
}

export interface PagedResult<T> {
  items: T[] | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface HotelFilters {
  search?: string;
  city?: string;
  minStarRating?: number;
  maxStarRating?: number;
  sortBy?: string;
  sortDescending?: boolean;
}
