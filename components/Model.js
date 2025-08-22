import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import styles from "@/styles/Home.module.css";

function ExchangeRatePredictor({ exchangeData }) {
  const [nextDayValue, setNextDayValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const windowSize = 10; // number of days used to predict the next day

  function normalizeData(data) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const normalized = data.map((d) => (d - min) / (max - min));
    return { normalized, min, max };
  }

  function denormalize(value, min, max) {
    return value * (max - min) + min;
  }

  async function trainModel(data) {
    const { normalized, min, max } = normalizeData(data);

    const inputSequence = [];
    const outputSequence = [];
    for (let i = 0; i < normalized.length - windowSize; i++) {
      inputSequence.push(normalized.slice(i, i + windowSize));
      outputSequence.push(normalized[i + windowSize]);
    }

    const xs = tf.tensor2d(inputSequence);
    const ys = tf.tensor2d(outputSequence, [outputSequence.length, 1]);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 32,
        inputShape: [windowSize],
        activation: "relu",
      })
    );
    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    const optimizer = tf.train.adam(0.01);
    model.compile({ loss: "meanSquaredError", optimizer });

    try {
      // Dynamically import tfvis to show training graph
      const tfvis = await import("@tensorflow/tfjs-vis");

      await model.fit(xs, ys, {
        epochs: 30,
        verbose: 0,
        callbacks: tfvis.show.fitCallbacks({ name: "Training Performance" }, [
          "loss",
        ]),
      });
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    tf.dispose([xs, ys]);
    return { model, min, max, normalized };
  }

  async function predictNextDayValue(modelData) {
    const { model, min, max, normalized } = modelData;
    const lastWindow = normalized.slice(-windowSize);
    const input = tf.tensor2d([lastWindow]);
    const prediction = model.predict(input);
    const predictedValue = prediction.dataSync()[0];
    input.dispose();
    prediction.dispose();
    return denormalize(predictedValue, min, max);
  }

  async function handlePredict() {
    try {
      setErrorMessage("");
      setNextDayValue(null);
      const modelData = await trainModel(exchangeData);
      const nextValue = await predictNextDayValue(modelData);
      setNextDayValue(nextValue);
    } catch (error) {
      setErrorMessage(error.message);
      setNextDayValue("Error");
    }
  }

  return (
    <>
      <hr className={styles.hr} />
      <h1 className={styles.title}>Next Day Predictor</h1>
      {nextDayValue !== null ? (
        <p className={styles.description}>
          The prediction is made with TensorFlow.js, training a model based on
          last year data. It is just a fun AI prediction, as it is almost
          impossible to predict exchange rates.
          <br />
          {isNaN(nextDayValue) ? (
            <div style={{ color: "red" }}>
              There was an error: {errorMessage}
            </div>
          ) : (
            <>
              The predicted exchange rate for the next day is:{" "}
              <mark className={styles.prediction}>
                {nextDayValue.toFixed(4)}
              </mark>
            </>
          )}
        </p>
      ) : (
        <>
          <p className={styles.description}>
            Press the button to train a model to make a prediction based on last
            year data. You will see the training loss graph appear.
          </p>
          <button className={styles.convertButton} onClick={handlePredict}>
            Predict
          </button>
        </>
      )}
    </>
  );
}

export default ExchangeRatePredictor;
