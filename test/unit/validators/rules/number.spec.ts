import { getValidationSchema, IsNumber, MoleculerParams } from '../../../../src';

describe('IsNumber', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsNumber()
      prop!: number;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'number' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsNumber({ convert: false })
      prop!: number;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'number', convert: false },
    });
  });
});
