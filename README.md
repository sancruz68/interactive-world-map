
# Interactive World Map — World Explorer

**Angular 22 | TypeScript | REST API | HTML | CSS**

World Explorer is an interactive web application I built using Angular and TypeScript. It allows users to explore countries through a clickable world map or search for them by name.

The application retrieves information from the World Bank API, including capital cities, regions, income levels, and geographic coordinates.

## Application Screenshot

![World Explorer Application](screenshots/world-explorer.png)

## Problem

Finding information about different countries often involves searching for each country individually.

I wanted to build an application that brings country information together in one place and makes it easier to explore through an interactive map.

## Solution

I developed a responsive Angular application that combines an interactive SVG world map with the World Bank REST API.

Users can select a country directly from the map or search for one by name. Once selected, the application retrieves the country's information and displays it alongside the map.

I also implemented country highlighting, loading indicators, error handling, and keyboard interaction to improve the user experience.

## Features

- **Interactive World Map:** Select countries by clicking on the map.
- **Country Search:** Search for countries by name and select matching results.
- **World Bank API Integration:** Retrieve country information from an external API.
- **Country Details:** Display capitals, regions, income classifications, and geographic coordinates.
- **Country Highlighting:** Visually identify hovered and selected countries.
- **Responsive Design:** Adjust the layout for different screen sizes.
- **Error Handling:** Display messages when API requests fail or information is unavailable.
- **Keyboard Support:** Select countries using Enter or Space.
- **Optimized Map Loading:** Load geographic data separately to reduce the initial JavaScript bundle size.

## Technologies Used

| Technology | Purpose |
|---|---|
| Angular 22 | Frontend application framework |
| TypeScript | Application logic and data handling |
| HTML & CSS | Interface structure and responsive styling |
| World Bank REST API | Country information |
| RxJS | Handling HTTP request timeouts |
| @svg-maps/world | Geographic SVG map data |
| Vitest | Automated testing |
| Git & GitHub | Version control and project management |

## How It Works

1. The application loads the world map data from a separate JSON file.
2. Users select a country by clicking on the map or using the search bar.
3. Angular sends an HTTP request to the World Bank API using the selected country's identifier.
4. The API returns the available country information.
5. The application displays the results in the Country Information panel.

I also implemented request handling to prevent older API responses from replacing information for a more recently selected country.

## Getting Started

To run this project locally, you'll need Node.js and npm installed.

### 1. Clone the Repository

```bash
git clone https://github.com/sancruz68/interactive-world-map.git
```

### 2. Open the Project Directory

```bash
cd interactive-world-map
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm start
```

### 5. Open the Application

Navigate to `http://localhost:4200/` in your browser.

### Production Build

```bash
npm run build
```

## Testing

I tested the application manually and added automated tests using Angular's testing tools and Vitest.

### Automated Tests

All four automated tests passed:

- Application initializes successfully.
- World Explorer title renders correctly.
- Country search filters matching results.
- Country selection retrieves and displays information from a simulated World Bank API response.

Run the tests using:

```bash
npm test -- --watch=false
```

The automated tests use simulated API responses, so they do not require an active connection to the World Bank API.

### Manual Testing

I also verified:

- Selecting countries directly from the map.
- Searching for countries and selecting matching results.
- Retrieving country information from the World Bank API.
- Handling searches with no matching countries.
- Checking the responsive layout on smaller browser windows.

The Angular production build also completed successfully.

## Performance Optimization

During development, I noticed that including the entire SVG world map dataset in the application made the initial JavaScript bundle unnecessarily large.

To address this, I moved the geographic data into a separate JSON file and updated Angular to retrieve it through an HTTP request.

### Results

| Metric | Before | After |
|---|---|---|
| Initial JavaScript bundle | 1.47 MB | 235.91 KB |
| Angular production build | Exceeded original size budget | Passed original size budget |

This reduced the initial JavaScript bundle size by approximately **84%**.

The geographic data still downloads separately, so this improvement specifically reduces the initial JavaScript bundle rather than the total amount of data downloaded by the application.

## Current Limitations

- Country information depends on the availability of the World Bank API.
- Some countries and territories may not have complete information available.
- The application currently requires a local development server and has not been publicly deployed.

## Future Improvements

- Expand automated test coverage.
- Improve search accessibility and keyboard navigation.
- Explore additional geographic and economic data.
- Deploy the application so it can be accessed online.

## Data Sources and Attribution

**Country Information:** [World Bank API](https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries)

**World Map:** [@svg-maps/world](https://github.com/VictorCazanave/svg-maps/tree/master/packages/world), based on map data originally from MapSVG.

The world map data is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

This application adds custom styling, interactive country selection, search functionality, and API integration to the map.
