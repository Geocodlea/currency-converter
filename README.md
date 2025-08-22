# Currency Converter

This is a simple currency converter app built with React and Next.js. Enter the amount you want to convert, select the source and target currencies, and the conversion rate will be displayed below. The rates are updated in real-time using data from the exchangerate.host API.

It also provides a prediction with TensorFlow.js, training a model based on last year data. It is just a fun AI prediction, as it is almost impossible to predict exchange rates.

## Usage

- For installing dependencies: `npm install`
- Add a .env.local file in the root of the project with: `NEXT_PUBLIC_API_KEY=YourApiKey`
- For running the project: `npm run dev`
- Open a web browser and go to: `localhost:3000`

> Choose a source currency and a target currency from the dropdowns, and the amount to be converted, than press the convert button.
> The Rates Chart shows the exchange rates for the chosen currencies, for 1 year.
> Pressing the predict button, will train a model and make a prediction for the next day, based on the last year of data.

### You can check the online example: [here](https://currency-converter-eight-tawny.vercel.app/)
