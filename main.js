import Bird from "./bird.js";
import Pipe from "./pipe.js";

// Set up the canvas element
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = 720;
canvas.height = 405;

let frameCount = 1;

let bird = new Bird();
let pipes = [];

function init() {
  pipes.push(new Pipe());
  requestAnimationFrame(draw);
}

window.addEventListener("mousedown", () => {
  bird.flap();
});

function draw() {
  // Set up the draw loop
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Handle all the pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    if (pipes[i].collides(bird)) {
      console.log("hit");
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // Handle the bird
  bird.update();
  bird.show();

  // Add new pipes
  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }

  frameCount++;
}


init();