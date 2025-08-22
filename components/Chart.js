import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Model from "../components/Model";

function todayDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  let formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

function oneYearAgoDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  let oneYearAgo = new Date();
  oneYearAgo.setDate(day);
  oneYearAgo.setMonth(month - 1);
  oneYearAgo.setFullYear(year - 1);

  let oneYearAgoYear = oneYearAgo.getFullYear();
  let oneYearAgoMonth = oneYearAgo.getMonth() + 1;
  let oneYearAgoDay = oneYearAgo.getDate();

  if (oneYearAgoMonth < 10) {
    oneYearAgoMonth = "0" + oneYearAgoMonth;
  }
  if (oneYearAgoDay < 10) {
    oneYearAgoDay = "0" + oneYearAgoDay;
  }

  let formattedDate =
    oneYearAgoYear + "-" + oneYearAgoMonth + "-" + oneYearAgoDay;
  return formattedDate;
}

function RatesChart({ sourceCurrency, targetCurrency }) {
  const [exchangeData, setExchangeData] = useState(null);
  const canvasRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(
      `https://api.exchangerate.host/timeframe?source=${sourceCurrency}&currencies=${targetCurrency}&start_date=${oneYearAgoDate()}&end_date=${todayDate()}&access_key=${
        process.env.NEXT_PUBLIC_API_KEY
      }`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }

        return response.json();
      })
      .then((data) => {
        const rates = Object.values(data.quotes).map(
          (obj) => obj[`${sourceCurrency}${targetCurrency}`]
        );
        setExchangeData(rates);
        setErrorMessage("");
      })
      .catch((error) => setErrorMessage(error.message));
  }, [sourceCurrency, targetCurrency]);

  useEffect(() => {
    if (errorMessage) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 365 }, (_, i) => i + 1),
        datasets: [
          {
            label: "Exchange rate",
            data: exchangeData,
            borderColor: "rgb(99, 178, 255)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Days",
            },
          },
          y: {
            title: {
              display: true,
              text: "Exchange rate",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [exchangeData]);

  return (
    <>
      {errorMessage ? (
        <div style={{ color: "red" }}>There was an error: {errorMessage}</div>
      ) : (
        <>
          <canvas ref={canvasRef} width={600} height={400}></canvas>
          <Model exchangeData={exchangeData} />
        </>
      )}
    </>
  );
}

export default RatesChart;
