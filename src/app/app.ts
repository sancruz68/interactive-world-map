
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';

// Country shapes used by the SVG world map
interface MapCountry {
  id: string;
  name: string;
  path: string;
}

interface WorldMapData {
  viewBox: string;
  locations: MapCountry[];
}

// Information returned by the World Bank API
interface WorldBankCountry {
  name: string;
  capitalCity: string;
  region: {
    value: string;
  };
  incomeLevel: {
    value: string;
  };
  latitude: string;
  longitude: string;
}

type WorldBankResponse = [
  { page: number },
  WorldBankCountry[]
];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private requestId = 0;

  // Map data is loaded separately from the JavaScript bundle
  worldMap: WorldMapData = {
    viewBox: '0 0 1000 500',
    locations: []
  };

  isMapLoading = true;
  mapErrorMessage = '';

  // Search
  searchQuery = '';

  // Selected country
  selectedCountryId = '';
  selectedCountryName = '';

  // World Bank country details
  countryDetails: WorldBankCountry | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadWorldMap();
  }

  // Load map data from the public folder
  private loadWorldMap(): void {

    this.http
      .get<WorldMapData>('world-map.json')
      .pipe(timeout(20000))
      .subscribe({

        next: (data) => {

          if (
            data &&
            typeof data.viewBox === 'string' &&
            Array.isArray(data.locations)
          ) {
            this.worldMap = data;
          } else {
            this.mapErrorMessage =
              'The world map data could not be loaded.';
          }

          this.isMapLoading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.mapErrorMessage =
            'Unable to load the world map. Please refresh the page.';

          this.isMapLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Find countries matching the search query
  get searchResults(): MapCountry[] {

    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return this.worldMap.locations
      .filter((country: MapCountry) =>
        country.name.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }

  // Update the search input
  onSearchInput(event: Event): void {

    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  // Select a country from the map or search
  selectCountry(id: string, name: string): void {

    this.selectedCountryId = id;
    this.selectedCountryName = name;
    this.searchQuery = '';

    this.countryDetails = null;
    this.errorMessage = '';
    this.isLoading = true;

    const currentRequest = ++this.requestId;

    const url =
      `https://api.worldbank.org/v2/country/${encodeURIComponent(id)}?format=json`;

    this.http
      .get<WorldBankResponse>(url)
      .pipe(timeout(10000))
      .subscribe({

        next: (response) => {

          // Ignore older API responses
          if (currentRequest !== this.requestId) {
            return;
          }

          const country =
            Array.isArray(response) &&
            Array.isArray(response[1])
              ? response[1][0]
              : undefined;

          if (country) {
            this.countryDetails = country;
          } else {
            this.errorMessage =
              'Country information is not available.';
          }

          this.isLoading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          if (currentRequest !== this.requestId) {
            return;
          }

          this.errorMessage =
            'Unable to load country information. Please try again.';

          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
