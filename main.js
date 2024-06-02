import Bird from "./bird.js";
import { reproduction } from "./ga.js";
import Pipe from "./pipe.js";

// Set up the canvas element
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 480;


export const populationSize = 200;
export let birds = [];
export let savedBirds = [];
let pipes = [];

let counter = 0;

function init() {
  tf.setBackend("cpu");

  for (let i = 0; i < populationSize; i++) {
    birds.push(new Bird());
  }

  requestAnimationFrame(draw);
}

window.addEventListener("mousedown", () => {
  // bird.flap();
});

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
    pipes = [];
  }
}


init();