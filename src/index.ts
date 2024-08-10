import { POP_SIZE } from "./low/const.js";
import Game from "./low/game.js";
import Population from "./population.js";

class Rockets extends Game {

  population: Population;

  constructor() {
    super();

    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#f00";
    this.ctx.textBaseline = "bottom";
    this.ctx.font = "16px Consolas";

    this.res.loadImages(["rocket.gif", "target.gif", "obs.gif", "obs2.gif", "obs3.gif"], () => {
      this.population = new Population(POP_SIZE);
      this.loop();
    });
  }

  update(dt: number): void {
    this.population.update(dt);
  }

  draw(): void {
    this.population.draw(this.ctx);
  }
}

const AL = new Rockets(); 