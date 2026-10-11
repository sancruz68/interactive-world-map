
import {
  Component,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import world from '@svg-maps/world';

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

  readonly worldMap = world;

  selectedCountryId = '';
  selectedCountryName = '';

  countryDetails: WorldBankCountry | null = null;

  isLoading = false;
  errorMessage = '';

  selectCountry(id: string, name: string): void {

    this.selectedCountryId = id;
    this.selectedCountryName = name;

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

          // Notify Angular that the information changed
          this.cdr.markForCheck();
        },

        error: () => {

          if (currentRequest !== this.requestId) {
            return;
          }

          this.errorMessage =
            'Unable to load country information. Please try again.';

          this.isLoading = false;

          // Update the page even when an API request fails
          this.cdr.markForCheck();
        }

      });
  }
}
