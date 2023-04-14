import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

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
  console.log(formattedDate);
  return formattedDate;
}

function RatesChart({ sourceCurrency, targetCurrency }) {
  const [exchangeData, setExchangeData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch(
      `https://api.exchangerate.host/timeseries?start_date=${oneYearAgoDate()}&end_date=${todayDate()}&base=${sourceCurrency}&symbols=${targetCurrency}`
    )
      .then((response) => response.json())
      .then((data) => {
        const rates = Object.entries(data.rates).map(([date, rates]) => {
          return rates[`${targetCurrency}`];
        });
        setExchangeData(rates);
      })
      .catch((error) => console.error(error));
  }, [sourceCurrency, targetCurrency]);

  useEffect(() => {
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

  return <canvas ref={canvasRef} width={600} height={400}></canvas>;
}

export default RatesChart;
