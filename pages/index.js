import styles from '@/styles/Home.module.css'
import Head from 'next/head'

import { useState } from 'react';

function CurrencyConverter() {
  const [sourceCurrency, setSourceCurrency] = useState('EUR');
  const [targetCurrency, setTargetCurrency] = useState('RON');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState();

  async function handleConvert() {
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${sourceCurrency}&symbols=${targetCurrency}`
    );
    const data = await response.json();
    const rate = data.rates[targetCurrency];
    setConversionRate(rate);
  }

  function handleSourceCurrencyChange(event) {
    setSourceCurrency(event.target.value);

  }

  function handleTargetCurrencyChange(event) {
    setTargetCurrency(event.target.value);
  }

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  return (
    <>
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="currency converter app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
      <h2>Currency Converter</h2>
      <div>
        <label>Source Currency: </label>
        <select value={sourceCurrency} onChange={handleSourceCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Target Currency: </label>
        <select value={targetCurrency} onChange={handleTargetCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      {conversionRate && (
        <p>
          {amount} {sourceCurrency} = {conversionRate * amount} {targetCurrency}
        </p>
      )}
    </div>
    </>
  );
}

const currencies = [
  { code: 'RON', name: 'Romanian Leu' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
];

export default CurrencyConverter;