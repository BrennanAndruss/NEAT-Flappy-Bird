export default class NeuralNetwork {
  constructor(a, b, c, d) {
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.inputNodes = b;
      this.hiddenNodes = c;
      this.outputNodes = d;
    } else {
      this.inputNodes = a;
      this.hiddenNodes = b;
      this.outputNodes = c;
      this.model = this.createModel();
    }
  }

  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: "relu"
    });
    model.add(hidden);

    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: "softmax"
    });
    model.add(output);

    return model;
  }

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];

      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }

      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.inputNodes,
        this.hiddenNodes,
        this.outputNodes
      );
    });
  }

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        const tensor = weights[i];
        const values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (Math.random() < rate) {
            values[j] += tf.randomNormal([1], 0, 0.1).dataSync()[0];
          }
        }

        const shape = weights[i].shape;
        mutatedWeights[i] = tf.tensor(values, shape);
      }

      this.model.setWeights(mutatedWeights);
    });
  }

  dispose() {
    this.model.dispose();
  }

  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      return outputs;
    });
  }
}