
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { App } from './app';

describe('World Explorer', () => {

  let fixture: ComponentFixture<App>;
  let component: App;
  let httpMock: HttpTestingController;

  const mockWorldMap = {
    viewBox: '0 0 1000 500',
    locations: [
      {
        id: 'ca',
        name: 'Canada',
        path: 'M0 0 L10 0 L10 10 Z'
      },
      {
        id: 'br',
        name: 'Brazil',
        path: 'M20 20 L30 20 L30 30 Z'
      }
    ]
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const mapRequest = httpMock.expectOne('world-map.json');
    mapRequest.flush(mockWorldMap);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Application creation
  it('should create the application', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Application title
  it('should display the World Explorer title', () => {

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');

    expect(heading?.textContent).toContain('World Explorer');
  });

  // Test 3: Search functionality
  it('should filter countries by name', async () => {

    const compiled = fixture.nativeElement as HTMLElement;

    const searchInput = compiled.querySelector(
      '#country-search'
    ) as HTMLInputElement;

    expect(searchInput).toBeTruthy();

    // Simulate a user typing into the search bar
    searchInput.value = 'can';

    searchInput.dispatchEvent(
      new Event('input', { bubbles: true })
    );

    // Wait for Angular to update the interface
    await fixture.whenStable();
    fixture.detectChanges();

    // Verify the matching country
    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].name).toBe('Canada');

    // Verify the result appears on the page
    const searchResults = compiled.querySelector(
      '.search-results'
    );

    expect(searchResults).not.toBeNull();

    expect(searchResults?.textContent ?? '').toContain(
      'Canada'
    );
  });

  // Test 4: World Bank API integration
  it('should retrieve country information when selected', () => {

    component.selectCountry('ca', 'Canada');

    const request = httpMock.expectOne(
      'https://api.worldbank.org/v2/country/ca?format=json'
    );

    request.flush([
      { page: 1 },
      [
        {
          name: 'Canada',
          capitalCity: 'Ottawa',
          region: {
            value: 'North America'
          },
          incomeLevel: {
            value: 'High income'
          },
          latitude: '45.4215',
          longitude: '-75.6919'
        }
      ]
    ]);

    fixture.detectChanges();

    expect(component.selectedCountryName).toBe('Canada');
    expect(component.countryDetails?.capitalCity).toBe('Ottawa');
    expect(component.isLoading).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ottawa');
  });

});
