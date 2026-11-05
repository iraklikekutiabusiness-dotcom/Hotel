import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelApiService } from '../data-access/hotel-api.service';
import { Hotel } from '../data-access/hotel.models';

@Component({
  selector: 'app-hotel-discovery-page',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './hotel-discovery-page.component.html',
  styleUrl: './hotel-discovery-page.component.scss',
})
export class HotelDiscoveryPageComponent implements OnInit {
  private readonly hotelsApi = inject(HotelApiService);
  private requestVersion = 0;

  readonly hotels = signal<Hotel[]>([]);
  readonly query = signal('');
  readonly city = signal('');
  readonly rating = signal('');
  readonly sort = signal('');
  readonly filtersOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly totalCount = signal(0);

  ngOnInit(): void {
    this.loadHotels();
  }

  search(): void {
    this.filtersOpen.set(false);
    const term = this.query().trim();
    if (term) {
      this.fetch(this.hotelsApi.search(term), `Couldn’t search hotels. Please try again.`);
    } else {
      this.loadHotels();
    }
  }

  applyFilters(): void {
    const selectedRating = Number(this.rating());
    const [sortBy, sortDescending] = this.sort().split(':');
    this.fetch(this.hotelsApi.filter({
      search: this.query().trim() || undefined,
      city: this.city() || undefined,
      minStarRating: selectedRating || undefined,
      maxStarRating: selectedRating || undefined,
      sortBy: sortBy || undefined,
      sortDescending: sortDescending ? sortDescending === 'desc' : undefined,
    }), `Couldn’t load hotels with these filters.`);
    this.filtersOpen.set(false);
  }

  resetFilters(): void {
    this.city.set('');
    this.rating.set('');
    this.sort.set('');
    this.query.set('');
    this.filtersOpen.set(false);
    this.loadHotels();
  }

  clearSearch(): void {
    this.query.set('');
    this.loadHotels();
  }

  private loadHotels(): void {
    this.fetch(this.hotelsApi.list(), 'Couldn’t load hotels. Please try again.');
  }

  private fetch(request: ReturnType<HotelApiService['list']>, message: string): void {
    const version = ++this.requestVersion;
    this.loading.set(true);
    this.error.set('');
    request.subscribe({
      next: (result) => {
        if (version !== this.requestVersion) return;
        this.hotels.set(result.items ?? []);
        this.totalCount.set(result.totalCount ?? result.items?.length ?? 0);
        this.loading.set(false);
      },
      error: () => {
        if (version !== this.requestVersion) return;
        this.hotels.set([]);
        this.totalCount.set(0);
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }

  location(hotel: Hotel): string {
    return [hotel.address?.city, hotel.address?.country].filter(Boolean).join(', ') || 'Georgia';
  }

  stars(count: number): string[] {
    return Array.from({ length: Math.max(0, Math.min(5, count)) });
  }
}
