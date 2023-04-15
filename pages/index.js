import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Chart from "../components/Chart";

function CurrencyConverter() {
  const [sourceCurrency, setSourceCurrency] = useState("EUR");
  const [targetCurrency, setTargetCurrency] = useState("RON");
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState();
  const [sourceCurrencyFlag, setSourceCurrencyFlag] = useState("eu");
  const [targetCurrencyFlag, setTargetCurrencyFlag] = useState("ro");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleConvert() {
    try {
      const response = await fetch(
        `https://api.exchangerate.host/latest?base=${sourceCurrency}&symbols=${targetCurrency}`
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      const rate = data.rates[targetCurrency];
      setConversionRate(rate);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleSourceCurrencyChange(event) {
    setSourceCurrency(event.target.value);
    setSourceCurrencyFlag(
      event.target.options[event.target.selectedIndex].getAttribute("flag")
    );
  }

  function handleTargetCurrencyChange(event) {
    setTargetCurrency(event.target.value);
    setTargetCurrencyFlag(
      event.target.options[event.target.selectedIndex].getAttribute("flag")
    );
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
      <div className={styles.container}>
        <h1 className={styles.title}>Currency Converter</h1>
        <p className={styles.description}>
          This is a simple currency converter app built with React and Next.js.
          Enter the amount you want to convert, select the source and target
          currencies, and the conversion rate will be displayed below. The rates
          are updated in real-time using data from the Open Exchange Rates API.
        </p>
        <div className={styles.currencyRow}>
          <div className={styles.currencyColumn}>
            <label className={styles.label}>From:</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={sourceCurrency}
                onChange={handleSourceCurrencyChange}
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                    flag={currency.flag}
                  >
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}></div>
            </div>
          </div>
          <div className={styles.currencyColumn}>
            <label className={styles.label}>To:</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={targetCurrency}
                onChange={handleTargetCurrencyChange}
              >
                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                    flag={currency.flag}
                  >
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}></div>
            </div>
          </div>
        </div>
        <div className={styles.amountRow}>
          <div className={styles.amountColumn}>
            <label className={styles.label}>Amount:</label>
            <div className={styles.amountWrapper}>
              <input
                className={styles.amountInput}
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
              <div className={styles.flag}>
                <span className={`fi fi-${sourceCurrencyFlag}`}></span>
              </div>
              <div className={styles.currencyCode}>{sourceCurrency}</div>
            </div>
          </div>
          <div className={styles.amountColumn}>
            <div className={styles.label}>&nbsp;</div>
            <div className={styles.amountWrapper}>
              <input
                className={styles.amountInput}
                type="number"
                value={
                  conversionRate ? (amount * conversionRate).toFixed(4) : ""
                }
                disabled
              />
              <div className={styles.flag}>
                <span className={`fi fi-${targetCurrencyFlag}`}></span>
              </div>
              <div className={styles.currencyCode}>{targetCurrency}</div>
            </div>
          </div>
        </div>
        <button className={styles.convertButton} onClick={handleConvert}>
          Convert
        </button>
        {errorMessage && (
          <div style={{ color: "red" }}>There was an error: {errorMessage}</div>
        )}
        <hr className={styles.hr} />
        <h1 className={styles.title}>Rates Chart</h1>
        <Chart
          sourceCurrency={sourceCurrency}
          targetCurrency={targetCurrency}
        />
      </div>
    </>
  );
}

const currencies = [
  { code: "RON", name: "Romanian Leu", flag: "ro" },
  { code: "USD", name: "US Dollar", flag: "us" },
  { code: "EUR", name: "Euro", flag: "eu" },
  { code: "GBP", name: "British Pound", flag: "gb" },
  { code: "JPY", name: "Japanese Yen", flag: "jp" },
  { code: "CAD", name: "Canadian Dollar", flag: "ca" },
  { code: "CHF", name: "Swiss Franc", flag: "ch" },
];

export default CurrencyConverter;
