import { HEIGHT, IMAGES, SCALE, WIDTH } from "./const.js";

export default class Game {

  loop: (time?: number) => void;

  draw(): void {
    throw new Error("Method not implemented.");
  }

  update(dt: number): void {
    throw new Error("Method not implemented.");
  }

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  res: Resource;
  lastTime: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.width = WIDTH * SCALE;
    this.canvas.height = HEIGHT * SCALE;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(SCALE, SCALE);
    this.ctx.imageSmoothingEnabled = false;

    document.body.appendChild(this.canvas);

    this.res = new Resource();

    this.lastTime = 0;

    this.loop = (time = 0) => {
      this.update(Math.min((time - this.lastTime) / 1000, .25));
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
      this.lastTime = time;
      requestAnimationFrame(this.loop);
    }
  }
}

class Resource {
  loadImages(path: string[], callback: any) {
    let idx = 0;
    const promises = [];
    path.forEach(f => promises.push(this.loadImage(`../img/${f}`)));
    Promise.all(promises).then((res) => {
      res.forEach(img => IMAGES[idx++] = img);
    }).then(callback);
  }

  mirrorImage(img: HTMLImageElement, horizontal: boolean = true): HTMLImageElement {
    const s = document.createElement("canvas");
    s.width = img.width;
    s.height = img.height;
    const c = s.getContext("2d");

    if (horizontal) {
      c.translate(s.width, 0);
      c.scale(-1, 1);

    } else {
      c.translate(0, s.height);
      c.scale(1, -1);
    }

    c.drawImage(img, 0, 0);

    const i = new Image();
    i.src = s.toDataURL();

    return i;
  }

  private loadImage(url: string) {
    return new Promise((resolve) => {
      const img: HTMLImageElement = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });
  }
}