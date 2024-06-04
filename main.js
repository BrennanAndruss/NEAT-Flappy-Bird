import Bird from "./bird.js";
import { reproduction } from "./ga.js";
import Pipe from "./pipe.js";

// Set up the canvas element
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 480;


// Set up TensorFlow.js
tf.setBackend("cpu");


// Set and get values from DOM elements
export let populationSize = 50;
const populationInput = document.getElementById("population-size");
populationInput.value = populationSize;
export let mutationRate = 0.1;
const mutationInput = document.getElementById("mutation-rate");
mutationInput.value = mutationRate * 100;

populationInput.addEventListener("input", (e) => {
  populationSize = Math.floor(e.target.value);
  populationInput.value = populationSize;
})

mutationInput.addEventListener("input", (e) => {
  mutationRate = e.target.value / 100;
})

document.getElementById("reset").addEventListener("click", (e) => {
  reset();
})

let counter = 0;
let generations = 1;


// Handle the game logic
export let birds = [];
export let savedBirds = [];
let pipes = [];

function init() {
  // Create an initial population of random birds
  document.getElementById("num-gens").innerHTML = "Generations: " + generations;
  for (let i = 0; i < populationSize; i++) {
    birds.push(new Bird());
  }

  // Start the draw loop
  requestAnimationFrame(draw);
}

function reset() {
  // Clear the current game state
  for (let bird of birds) {
    bird.dispose();
  }
  birds = [];
  for (let bird of savedBirds) {
    bird.dispose();
  }
  savedBirds = [];
  pipes = [];
  counter = 0;
  generations = 1;

  // Create a new random population
  document.getElementById("num-gens").innerHTML = "Generations: " + generations;
  for (let i = 0; i < populationSize; i++) {
    birds.push(new Bird());
  }
}

function draw() {
  // Set up the draw loop
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add new pipes
  if (counter % 100 === 0) {
    pipes.push(new Pipe());
  }
  counter++;

  // Handle all the pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    for (let j = birds.length - 1; j >= 0; j--) {
      if (pipes[i].collides(birds[j])) {
        savedBirds.push(birds.splice(j, 1)[0])
      }
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // Handle the bird
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].think(pipes);
    birds[i].update();
    birds[i].show();

    if (birds[i].offscreen()) {
      savedBirds.push(birds.splice(i, 1)[0]);
    }
  }

  if (birds.length === 0) {
    counter = 0;
    reproduction();
    generations++;
    document.getElementById("num-gens").innerHTML = "Generations: " + generations;
    pipes = [];
  }
}


init();