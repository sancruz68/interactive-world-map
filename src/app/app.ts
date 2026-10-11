
import {
  Component,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import world from '@svg-maps/world';

// World map country data
interface MapCountry {
  id: string;
  name: string;
  path: string;
}

// World Bank API response
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
export class App {

  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private requestId = 0;

  // World map data
  readonly worldMap = world as {
    viewBox: string;
    locations: MapCountry[];
  };

  // Search
  searchQuery = '';

  // Selected country
  selectedCountryId = '';
  selectedCountryName = '';

  // Country information
  countryDetails: WorldBankCountry | null = null;

  // Loading and errors
  isLoading = false;
  errorMessage = '';

  // Filter countries based on search input
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

  // Update search text
  onSearchInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.searchQuery = input.value;
  }

  // Select a country from the map or search
  selectCountry(id: string, name: string): void {

    this.selectedCountryId = id;
    this.selectedCountryName = name;

    // Clear search after selecting a country
    this.searchQuery = '';

    // Reset previous country information
    this.countryDetails = null;
    this.errorMessage = '';
    this.isLoading = true;

    const currentRequest = ++this.requestId;

    // World Bank API endpoint
    const url =
      `https://api.worldbank.org/v2/country/${encodeURIComponent(id)}?format=json`;

    // Request country information
    this.http
      .get<WorldBankResponse>(url)
      .pipe(timeout(10000))
      .subscribe({

        next: (response) => {

          // Ignore outdated requests
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

          // Update Angular interface
          this.cdr.markForCheck();
        },

        error: () => {

          if (currentRequest !== this.requestId) {
            return;
          }

          this.errorMessage =
            'Unable to load country information. Please try again.';

          this.isLoading = false;

          // Update Angular interface
          this.cdr.markForCheck();
        }

      });
  }
}
