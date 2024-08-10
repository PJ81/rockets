export class LCG {

  protected m: number;
  protected a: number;
  protected c: number;
  protected state: number;

  constructor(seed: number) {
    this.m = 1;
    this.a = 0;
    this.c = 0;
    this.seed(seed);
  }

  seed(seed: number = 0): void {
    this.state = seed !== 0 ? seed : Date.now();
    this.state = this.state % this.m; // ensure the seed is within bounds
  }

  protected rnd(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / this.m;
  }

  rndMod(n: number): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state % n;
  }

  random(i: number = 1, a?: number): number {
    if (!a) return this.rnd() * i;
    return this.rnd() * (a - i) + i;
  }

  randInt(i: number = 1, a?: number): number {
    if (!a) return ~~(this.rnd() * i);
    return ~~(this.rnd() * (a - i) + i);
  }

  rollDice(diceSides: number = 6, diceCount: number = 1): number {
    let res = 0;
    for (let q = 0; q < diceCount; q++) {
      res += ~~(this.random(diceSides)) + 1;
    }
    return res;
  }

  choose<T>(arr: T[]): T {
    return arr[~~this.random(arr.length)];
  }

  randArray<T>(arr: T[]): T[] {
    return arr.sort(() => this.random(-1, 1));
  }
}

export class JS {
  protected rnd(): number {
    return;
  }

  random(i: number = 1, a?: number): number {
    if (!a) return Math.random() * i;
    return Math.random() * (a - i) + i;
  }

  randInt(i: number = 1, a?: number): number {
    if (!a) return ~~(Math.random() * i);
    return ~~(Math.random() * (a - i) + i);
  }

  rollDice(diceSides: number = 6, diceCount: number = 1): number {
    let res = 0;
    for (let q = 0; q < diceCount; q++) {
      res += ~~(this.randInt(diceSides)) + 1;
    }
    return res;
  }

  choose<T>(arr: T[]): T {
    return arr[~~this.randInt(arr.length)];
  }

  randArray<T>(arr: T[]): T[] {
    return arr.sort(() => this.random(-1, 1));
  }
}

export class Knuth extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 1664525;
    this.c = 1013904223;
    this.m = 2 ** 32;
    this.seed(seed);
  }
}

export class Numerical_Recipes extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 1664525;
    this.c = 1013904223;
    this.m = 2 ** 32;
    this.seed(seed);
  }
}

export class RtlUniform extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 2397753;
    this.c = 1;
    this.m = 2 ** 64 - 59;//2 ** 48 - 1;
    this.seed(seed);
  }
}

export class Microsoft extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 214013;
    this.c = 2531011;
    this.m = 2 ** 32;
    this.seed(seed);
  }
}

export class Park_Miller extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 16807;
    this.c = 0;
    this.m = (2 ** 31) - 1;
    this.seed(seed);
  }
}

export class CarbonLib extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 16807;
    this.c = 0;
    this.m = (2 ** 31) - 1;
    this.seed(seed);
  }
}

export class VB6 extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 16598013;
    this.c = 12820163;
    this.m = 2 ** 24;
    this.seed(seed);
  }
}

export class VMS extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 69069;
    this.c = 1;
    this.m = 2 ** 32;
    this.seed(seed);
  }
}

export class Lehmer extends LCG {
  constructor(seed: number = 0) {
    super(seed);
    this.a = 48271;
    this.c = 0;
    this.m = (2 ** 31) - 1;
    this.seed(seed);
  }
}

export class Park_Miller32 extends LCG {
  Q: number;
  R: number;

  constructor(seed: number = 0) {
    super(seed);

    this.m = 0x7fffffff;
    this.a = 48271;
    this.Q = this.m / this.a;
    this.R = this.m % this.a;
    this.seed(seed);
  }

  rnd(): number {
    let div = this.state / this.Q;
    let rem = this.state % this.Q;
    let s = rem * this.a;
    let t = div * this.R;

    this.state = s - t;
    if (this.state < 0) {
      this.state += this.m;
    }

    return this.state / this.m;
  }
}

export class Lehmer32 extends LCG {

  constructor(seed: number = 0) {
    super(seed);
    this.seed(seed);
  }

  seed(seed: number = 0): void {
    this.state = seed !== 0 ? seed : Date.now();
  }

  rndInt(n: number): number {
    this.state = (this.state + 0xe120fc15) >>> 0;
    let tmp = (BigInt(this.state) * BigInt(0x4a39b70d)) >> 0n;
    let m1 = Number((tmp >> 32n) ^ tmp);
    tmp = (BigInt(m1) * BigInt(0x12fad5c9)) >> 0n;
    let m2 = BigInt((tmp >> 32n) ^ tmp);
    let r = (m2 >> 32n) % BigInt(n);
    return Number(r);
  }
}
