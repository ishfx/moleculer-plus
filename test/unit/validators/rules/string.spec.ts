import { getValidationSchema, IsString, MoleculerParams } from '../../../../src';

describe('IsString', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsString()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'string', empty: false },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsString({ empty: true })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'string', empty: true },
    });
  });
});
