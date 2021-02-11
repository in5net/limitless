import { clamp, lerp, random } from '../funcs';
import Vector from './vec';

type First = number | [x: number, y: number, z: number] | Vector3;

export default class Vector3 extends Vector {
  x!: number;
  y!: number;
  z!: number;

  constructor(x: First = 0, y?: number, z?: number) {
    super();
    this.set(x, y, z);
  }

  toString(): string {
    const { x, y, z } = this;
    return `vec3 <${x}, ${y}, ${z}>`;
  }

  copy(): Vector3 {
    return vec3(+this.x, +this.y, +this.z);
  }

  set(x: First, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (x instanceof Array) {
      [this.x, this.y, this.z] = x;
    } else if (typeof y === 'undefined') {
      this.x = x;
      this.y = x;
      this.z = x;
    } else {
      this.x = x;
      this.y = y || 0;
      this.z = z || 0;
    }
    return this;
  }

  static random(mag = 1): Vector3 {
    return vec3(0, 0, 1)
      .rotateX(random(Math.PI * 2))
      .rotateY(random(Math.PI * 2))
      .setMag(mag);
  }

  equals(x: First, y = 0, z = 0): boolean {
    if (x instanceof Vector3)
      return this.x === x.x && this.y === x.y && this.z === x.z;
    if (x instanceof Array)
      return this.x === x[0] && this.y === x[1] && this.z === x[2];

    return this.x === x && this.y === y && this.z === z;
  }

  add(x: First, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this.x += x.x;
      this.y += x.y;
      this.z += x.z;
    } else if (x instanceof Array) {
      this.x += x[0];
      this.y += x[1];
      this.z += x[2];
    } else if (typeof y === 'undefined') {
      this.x += x;
      this.y += x;
      this.z += x;
    } else {
      this.x += x;
      this.y += y || 0;
      this.z += z || 0;
    }
    return this;
  }
  static add(v1: Vector3, x: First, y?: number, z?: number): Vector3 {
    return v1.copy().add(x, y, z);
  }

  sub(x: First, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this.x -= x.x;
      this.y -= x.y;
      this.z -= x.z;
    } else if (x instanceof Array) {
      this.x -= x[0];
      this.y -= x[1];
      this.z -= x[2];
    } else if (typeof y === 'undefined') {
      this.x -= x;
      this.y -= x;
      this.z -= x;
    } else {
      this.x -= x;
      this.y -= y || 0;
      this.z -= z || 0;
    }
    return this;
  }
  static sub(v1: Vector3, x: First, y?: number, z?: number): Vector3 {
    return v1.copy().sub(x, y, z);
  }

  mult(x: First, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this.x *= x.x;
      this.y *= x.y;
      this.z *= x.z;
    } else if (x instanceof Array) {
      this.x *= x[0];
      this.y *= x[1];
      this.z *= x[2];
    } else if (typeof y === 'undefined') {
      this.x *= x;
      this.y *= x;
      this.z *= x;
    } else {
      this.x *= x;
      this.y *= y ?? 1;
      this.z *= z ?? 1;
    }
    return this;
  }
  static mult(v1: Vector3, x: First, y?: number, z?: number): Vector3 {
    return v1.copy().mult(x, y, z);
  }

  div(x: First, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this.x /= x.x;
      this.y /= x.y;
      this.z /= x.z;
    } else if (x instanceof Array) {
      this.x /= x[0];
      this.y /= x[1];
      this.z /= x[2];
    } else if (typeof y === 'undefined') {
      this.x /= x;
      this.y /= x;
      this.z /= x;
    } else {
      this.x /= x;
      this.y /= y ?? 1;
      this.z /= z ?? 1;
    }
    return this;
  }
  static div(v1: Vector3, x: First, y?: number, z?: number): Vector3 {
    return v1.copy().div(x, y, z);
  }

  magSq(): number {
    const { x, y, z } = this;
    return x ** 2 + y ** 2 + z ** 2;
  }

  distSq(v: Vector3): number {
    return Vector3.sub(v, this).magSq();
  }

  dot(v: Vector3): number {
    const { x, y, z } = this;
    return x * v.x + y * v.y + z * v.z;
  }

  cross(v: Vector3): Vector3 {
    const { x, y, z } = this;
    return vec3(y * v.z - z * v.y, z * v.x - x * v.z, x * v.y - y * v.x);
  }

  lerp(v: Vector3, norm: number): this {
    const { x, y, z } = this;
    this.x = lerp(x, v.x, norm);
    this.y = lerp(y, v.y, norm);
    this.z = lerp(z, v.z, norm);
    return this;
  }
  static lerp(v1: Vector3, v2: Vector3, norm: number): Vector3 {
    return v1.copy().lerp(v2, norm);
  }

  clamp(min: Vector3, max: Vector3): this {
    const { x, y, z } = this;
    this.x = clamp(x, min.x, max.x);
    this.y = clamp(y, min.y, max.y);
    this.z = clamp(z, min.z, max.z);
    return this;
  }
  static clamp(v: Vector3, min: Vector3, max: Vector3): Vector3 {
    return v.copy().clamp(min, max);
  }

  rotateX(angle: number): this {
    const { y, z } = this;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.y = cos * y - sin * z;
    this.z = sin * y + cos * z;
    return this;
  }
  rotateY(angle: number): this {
    const { x, z } = this;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.x = cos * x + sin * z;
    this.z = -sin * x + cos * z;
    return this;
  }
  rotateZ(angle: number): this {
    const { x, y } = this;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;
    return this;
  }

  reflect(normal: Vector3): this {
    return this.sub(Vector3.mult(normal, 2 * this.dot(normal)));
  }
}

export function vec3(x?: First, y?: number, z?: number): Vector3 {
  return new Vector3(x, y, z);
}
