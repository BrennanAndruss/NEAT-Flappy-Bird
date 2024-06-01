import { canvas, ctx } from "./main.js";

export default class Bird {
  constructor() {
    this.x = 50;
    this.y = 256;
    this.r = 9;
    this.gravity = 0.5;
    this.velocity = 0;
    this.flapVelocity = -10;
    this.maxVelocity = 10;
  }

  flap() {
    this.velocity = this.flapVelocity;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.velocity *= 0.95;

    if (this.y > canvas.height) {
      this.y = canvas.height;
      this.velocity = 0;
    }
  }

  show() {
    ctx.fillStyle = "lightgrey";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
}