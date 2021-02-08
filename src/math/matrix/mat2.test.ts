import { expect } from 'chai';
import { mat2 } from './mat2';

describe('mat2', () => {
  it('should add', () => {
    const m1 = mat2();
    const m2 = mat2([
      [6, 3],
      [-7, 2]
    ]);
    m1.add(m2);
    expect(m1).to.deep.equal(
      mat2([
        [7, 3],
        [-7, 3]
      ])
    );
  });
  it('should subtract', () => {
    const m1 = mat2();
    const m2 = mat2([
      [6, 3],
      [-7, 2]
    ]);
    m1.sub(m2);
    expect(m1).to.deep.equal(
      mat2([
        [-5, -3],
        [7, -1]
      ])
    );
  });
  it('should multiply', () => {
    let m1 = mat2();
    let m2 = mat2([
      [6, 3],
      [-7, 2]
    ]);
    m1.mult(m2);
    expect(m2).to.deep.equal(
      mat2([
        [-5, -3],
        [7, -1]
      ])
    );

    m1 = mat2([
      [4, -7],
      [2, 1]
    ]);
    m2 = mat2([
      [4, -5],
      [8, 7]
    ]);
    m1.mult(m2);
    expect(m1).to.deep.equal(
      mat2([
        [-40, -69],
        [16, -3]
      ])
    );
  });
});
