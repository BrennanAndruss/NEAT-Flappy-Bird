import { canvas, ctx, mutationRate } from "./main.js";
import NeuralNetwork from "./nn.js";

export default class Bird {
  constructor(brain) {
    this.x = 50;
    this.y = 256;
    this.r = 9;

    this.gravity = 0.5;
    this.velocity = 0;
    this.flapVelocity = -10;

    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(2, 8, 2); // temp
    }
  }

  think(pipes) {
    let nextPipe;
    for (let pipe of pipes) {
      if (pipe.x + pipe.w > this.x - this.r) {
        nextPipe = pipe;
        break;
      }
    }

    let inputs = [
      (nextPipe.x + nextPipe.w / 2 - this.x) / canvas.width,
      (nextPipe.top + nextPipe.gap / 2 - this.y) / canvas.height,
      // this.velocity / canvas.height,
      // this.y / canvas.height
    ];

    let prediction = this.brain.predict(inputs);
    // console.log(prediction[0]);
    // if (prediction[0] >= 0.5) {
    //   this.flap();
    // }

    if (prediction[0] > prediction[1]) {
      this.flap();
    }
  }

  mutate() {
    this.brain.mutate(mutationRate);
  }

  dispose() {
    this.brain.dispose();
  }

  flap() {
    this.velocity = this.flapVelocity;
  }

  offscreen() {
    return this.y - this.r > canvas.height || this.y + this.r < 0;
  }

  update() {
    this.fitness++;

    this.velocity += this.gravity;
    this.y += this.velocity;
    this.velocity *= 0.95;
  }

  show() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
}