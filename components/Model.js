import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import styles from "@/styles/Home.module.css";

function ExchangeRatePredictor({ exchangeData }) {
  const [nextDayValue, setNextDayValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function trainModel(data) {
    // Split the data into input and output sequences
    const inputSequence = [];
    const outputSequence = [];
    const numInputSequences = data.length / 2;
    for (let i = 0; i < numInputSequences; i++) {
      inputSequence.push(data.slice(i, i + numInputSequences));
      outputSequence.push(data[i + numInputSequences]);
    }

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 183, inputShape: [numInputSequences] }));
    model.add(tf.layers.dense({ units: 90, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    const learningRate = 0.00001;
    const optimizer = tf.train.adam(learningRate);

    // Compile the model
    model.compile({ loss: "meanSquaredError", optimizer: optimizer });

    try {
      await model.fit(tf.tensor2d(inputSequence), tf.tensor1d(outputSequence), {
        epochs: 30,
        callbacks: tfvis.show.fitCallbacks({ name: "Training Performance" }, [
          "loss",
        ]),
      });
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    // Dispose of the tensors created in this function
    tf.dispose([inputSequence, outputSequence]);

    return model;
  }

  async function predictNextDayValue(model, data) {
    // Use the model to predict the next value
    try {
      const input = tf.tensor2d([data.slice(0, data.length / 2)]);
      const prediction = model.predict(input);
      input.dispose();
      return prediction.dataSync()[0];
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }
  }

  async function handlePredict() {
    try {
      const model = await trainModel(exchangeData);
      const nextDayValue = await predictNextDayValue(model, exchangeData);
      setNextDayValue(nextDayValue);
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
            year data. You have to wait a little bit for the model to train.
            While training, you can see the model improving (loss getting close
            to zero), on the graphs that will appear.
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
