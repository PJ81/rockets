import DNA from "./dna.js";
import { DNA_ANG, DNA_SPD, DNA_TIME, HEIGHT, IMAGES, LIFE_SPAN, WIDTH } from "./low/const.js";
import Point from "./low/point.js";

export default class Rocket {

  dna: DNA;
  pos: Point;
  dir: Point;
  idx: number;
  currDNA: number[];
  wid: number;
  hei: number;
  dead: boolean;
  done: boolean;
  fitness: number;

  constructor(a?: DNA) {
    this.dead = false;
    this.dir = new Point();
    this.dna = a || new DNA();
    this.idx = 0;
    this.wid = IMAGES[0].width >> 1;
    this.hei = IMAGES[0].height >> 1;
    this.pos = new Point(WIDTH / 2, HEIGHT - IMAGES[0].height * 2);
    this.currDNA = [0, 0, 0];
    this.done = false;
    this.fitness = 0;
  }

  update(dt: number): void {

    if ((this.currDNA[DNA_TIME] -= dt) < 0) {
      this.currDNA = this.dna.get(this.idx);

      this.dir.set(1, 0);
      this.dir.rotateAng(this.currDNA[DNA_ANG]);

      if (++this.idx >= LIFE_SPAN) {
        this.dead = true;
      }
    }

    const s = this.currDNA[DNA_SPD] * dt;

    this.pos.x += this.dir.x * s;
    this.pos.y += this.dir.y * s;

    if (this.pos.x < -this.wid || this.pos.y < -this.hei || this.pos.x > WIDTH + this.wid || this.pos.y > HEIGHT - this.hei) {
      this.dead = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.pos.x - this.wid, this.pos.y - this.hei);
    ctx.rotate(this.currDNA[DNA_ANG]);
    ctx.drawImage(IMAGES[0], 0, 0);
    ctx.restore();
  }
}