import { getValidationSchema, IsBoolean, MoleculerParams } from '../../../../src';

describe('IsBoolean', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsBoolean()
      prop!: boolean;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'boolean' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsBoolean({ optional: true })
      prop!: boolean;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'boolean', optional: true },
    });
  });
});
