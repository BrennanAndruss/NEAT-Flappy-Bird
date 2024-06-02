import { canvas, ctx } from "./main.js";

export default class Pipe {
  constructor() {
    this.gap = 100;
    this.top = Math.random() * (canvas.height - this.gap * 3) + this.gap;
    this.bottom = this.top + this.gap;
    this.x = canvas.width;
    this.w = 20;
    this.velocity = 2;
  }

  collides(bird) {
    let verticalCollision =
      bird.y - bird.r < this.top || bird.y + bird.r > this.bottom;
    let horizontalCollision =
      bird.x + bird.r > this.x && bird.x - bird.r < this.x + this.w;

    return verticalCollision && horizontalCollision;
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  update() {
    this.x -= this.velocity;
  }

  show() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(this.x, 0, this.w, this.top);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(this.x, this.bottom, this.w, canvas.height - this.bottom);
    ctx.fill();
  }
}