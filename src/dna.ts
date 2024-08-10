import { LIFE_SPAN, R, TWO_PI } from "./low/const.js";

export default class DNA {

  dir: number[];
  spd: number[];
  tts: number[];

  constructor(c: boolean = false) {
    this.dir = [];
    this.tts = [];
    this.spd = [];

    for (let z = 0; z < LIFE_SPAN; z++) {
      this.dir.push(c ? 0 : R.random(TWO_PI));
      this.tts.push(c ? 0 : R.randInt(2, 4) / 5);
      this.spd.push(c ? 0 : R.randInt(3, 7) * 35);
    }
  }

  get(idx: number): number[] {
    return [this.dir[idx], this.spd[idx], this.tts[idx]];
  }

  crossover(o: DNA): DNA {
    const nDna = new DNA(true);
    for (let z = 0; z < LIFE_SPAN; z++) {
      nDna.dir[z] = R.random() < .5 ? this.dir[z] : o.dir[z];
      nDna.tts[z] = R.random() > .5 ? this.tts[z] : o.tts[z];
      nDna.spd[z] = R.random() < .5 ? this.spd[z] : o.spd[z];
    }
    return nDna;
  }

  mutate(): void {
    for (let z = 0; z < LIFE_SPAN; z++) {
      if (R.random() < .02) {
        this.dir[z] = R.random(TWO_PI);
        this.tts[z] = R.randInt(2, 4) / 5;
        this.spd[z] = R.randInt(5, 7) * 35;
      }
    }
  }
}