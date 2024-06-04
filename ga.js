import Bird from "./bird.js";
import { birds, populationSize, savedBirds } from "./main.js";
import NeuralNetwork from "./nn.js";

export function reproduction() {
  normalizeFitness();

  // Create a new population of birds using genetic algorithms
  for (let i = 0; i < populationSize; i++) {
    let parentA = weightedSelection();
    let parentB = weightedSelection();

    let child = crossover(parentA, parentB);
    child.mutate(0.1);

    birds[i] = child;
  }

  // Clear memory of old birds and tensors
  for (let bird of savedBirds) {
    bird.dispose();
  }

  savedBirds.length = 0;
}

function crossover(parentA, parentB) {
  return tf.tidy(() => {
    const aWeights = parentA.brain.model.getWeights();
    const bWeights = parentB.brain.model.getWeights();
    const childWeights = [];

    for (let i = 0; i < aWeights.length; i++) {
      const aTensor = aWeights[i];
      const bTensor = bWeights[i];
      const aValues = aTensor.dataSync().slice();
      const bValues = bTensor.dataSync().slice();
      const childValues = [];
      const midpoint = Math.floor(Math.random() * aWeights.length);

      for (let j = 0; j < aValues.length; j++) {
        j < midpoint
          ? childValues[j] = aValues[j]
          : childValues[j] = bValues[j];
      }

      const shape = aWeights[i].shape;
      childWeights[i] = tf.tensor(childValues, shape);
    }

    const childBrain = new NeuralNetwork(
      parentA.brain.inputNodes,
      parentA.brain.hiddenNodes,
      parentA.brain.outputNodes
    );
    childBrain.model.setWeights(childWeights);

    return new Bird(childBrain);
  });
}

function weightedSelection() {
  let i = 0;
  let start = Math.random();
  while (start > 0 && i < savedBirds.length) {
    start = start - savedBirds[i].fitness;
    i++;
  }
  i--;

  return savedBirds[i];
}

function normalizeFitness() {
  // Sum the total fitness of all birds
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.fitness;
  }

  // Divide each bird's fitness by the sum
  for (let bird of savedBirds) {
    bird.fitness = bird.fitness / sum;
  }
}