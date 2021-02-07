import Body from '../body';

export default class Particle extends Body {
  constructor(x: number, y: number, public life = 4) {
    super(x, y);
  }

  update(dt: number): this {
    this.life -= dt;
    return super.update(dt);
  }
}
