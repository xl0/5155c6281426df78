## Multiple Streamable UIs

Return multiple streamable UI components in a single server action response. Each streamable can update independently based on async operations.

```tsx
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

export async function getWeather() {
  const weatherUI = createStreamableUI();
  const forecastUI = createStreamableUI();

  weatherUI.update(<div>Loading weather...</div>);
  forecastUI.update(<div>Loading forecast...</div>);

  getWeatherData().then(weatherData => {
    weatherUI.done(<div>{weatherData}</div>);
  });

  getForecastData().then(forecastData => {
    forecastUI.done(<div>{forecastData}</div>);
  });

  return {
    requestedAt: Date.now(),
    weather: weatherUI.value,
    forecast: forecastUI.value,
  };
}
```

The returned object contains both streamable UIs and other data fields. Components update independently based on when their data resolves.

## Nested Streamable UIs

Stream UI components within other UI components by passing streamables as props. Child components automatically update as the server sends new data.

```tsx
'use server';
async function getStockHistoryChart({ symbol }: { symbol: string }) {
  const ui = createStreamableUI(<Spinner />);

  (async () => {
    const price = await getStockPrice({ symbol });
    const historyChart = createStreamableUI(<Spinner />);
    ui.done(<StockCard historyChart={historyChart.value} price={price} />);

    const historyData = await fetch('https://my-stock-data-api.com');
    historyChart.done(<HistoryChart data={historyData} />);
  })();

  return ui;
}
```

Wrap async operations in an IIFE to avoid blocking. Parent components render child streamables which update independently.