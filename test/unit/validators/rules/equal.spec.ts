import { getValidationSchema, IsEqual, MoleculerParams } from '../../../../src';

describe('IsEqual', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsEqual()
      prop!: unknown;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'equal' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsEqual({ field: 'otherField' })
      prop!: unknown;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'equal', field: 'otherField' },
    });
  });
});
