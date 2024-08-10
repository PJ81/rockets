import { IMAGES, R, WIDTH } from "./low/const.js";
import Point from "./low/point.js";
import Rocket from "./rocket.js";

class Obstacle {
  tl: Point;
  br: Point;
  img: HTMLImageElement;

  constructor(pos: Point, img: HTMLImageElement) {
    const w = img.width / 2, h = img.height / 2;
    this.tl = new Point(pos.x - w, pos.y - h);
    this.br = new Point(pos.x + w, pos.y + h);
    this.img = img;
  }

  inRect(pt: Point): boolean {
    return (
      pt.x >= this.tl.x && pt.x <= this.br.x &&
      pt.y >= this.tl.y && pt.y <= this.br.y
    );
  }

  draw(ctx: CanvasRenderingContext2D, drawBox: boolean = false): void {
    ctx.drawImage(this.img, this.tl.x, this.tl.y);

    if (drawBox) {
      ctx.beginPath()
      ctx.moveTo(this.tl.x, this.tl.y)
      ctx.lineTo(this.br.x, this.tl.y)
      ctx.lineTo(this.br.x, this.br.y)
      ctx.lineTo(this.tl.x, this.br.y)
      ctx.closePath()
      ctx.stroke()
    }
  }
}

export default class Population {

  rockets: Rocket[];

  popSize: number;

  obst: Obstacle[];

  generation: number;

  constructor(popSize: number) {
    this.popSize = popSize;
    this.rockets = [];
    this.obst = [];

    this.obst.push(new Obstacle(new Point(WIDTH / 2, 60), IMAGES[1]));
    this.obst.push(new Obstacle(new Point(WIDTH / 2, 320), IMAGES[2]));
    this.obst.push(new Obstacle(new Point(240, 320), IMAGES[3]));

    this.obst.push(new Obstacle(new Point(410, 320), IMAGES[3]));
    this.obst.push(new Obstacle(new Point(WIDTH - 320 - IMAGES[3].width, 320), IMAGES[3]));

    this.obst.push(new Obstacle(new Point(WIDTH - 152 - IMAGES[3].width, 320), IMAGES[3]));
    this.obst.push(new Obstacle(new Point(WIDTH / 2, 520), IMAGES[4]));
    this.obst.push(new Obstacle(new Point(240, 520), IMAGES[2]));
    this.obst.push(new Obstacle(new Point(WIDTH - 16 - IMAGES[2].width, 520), IMAGES[2]));

    this.generation = 1;
    for (let a = 0; a < popSize; a++) {
      this.rockets.push(new Rocket());
    }
  }

  update(dt: number): void {
    let alive = false;

    for (let z = 0; z < this.rockets.length; z++) {
      const r = this.rockets[z];

      if (r.dead || r.done) continue;

      if (this.obst[0].inRect(r.pos)) {
        r.done = true;

        r.pos.set(this.obst[0].tl.x + IMAGES[1].width / 2, this.obst[0].tl.y + IMAGES[1].height / 2,);
        //r.currDNA[DNA_ANG] = 0;
        continue;
      }

      for (let o = 1; o < this.obst.length; o++) {
        if (this.obst[o].inRect(r.pos)) {
          r.dead = true;
          break;
        }
      }

      if (r.dead) continue;

      alive = true;
      r.update(dt);
    }

    if (!alive) {
      let maxF = 0;

      for (const r of this.rockets) {
        const dst = r.pos.dist(this.obst[0].tl);
        if (dst === 0) r.fitness = 3;
        else r.fitness += (1 / dst);
        if (r.fitness > maxF) maxF = r.fitness;
      }

      for (let i = 0; i < this.rockets.length; i++) {
        const r = this.rockets[i];
        r.fitness = Math.ceil((r.fitness / maxF) * 20);
      }

      this.recreatePopulation();
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {

    ctx.fillText(`Generation ${this.generation}`, 10, 20);

    for (let o = 0; o < this.obst.length; o++) {
      this.obst[o].draw(ctx);
    }

    this.rockets.forEach(r => r.draw(ctx));
  }

  recreatePopulation() {

    let pool: Rocket[] = [];
    const ng: Rocket[] = [];

    for (let i = 0; i < this.rockets.length; i++) {
      const r = this.rockets[i];
      for (let u = 0; u < r.fitness; u++) {
        pool.push(r);
      }
    }

    pool = R.randArray(pool);

    for (let z = 0; z < this.rockets.length; z++) {

      let a = R.choose(pool).dna,
        b = R.choose(pool).dna;

      const n = a.crossover(b);

      n.mutate();

      ng.push(new Rocket(n));

      a = b = null;
    }

    this.rockets = Array.from(ng);
    this.generation++;
  }

}