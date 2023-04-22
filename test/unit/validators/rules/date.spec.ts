import { getValidationSchema, IsDate, MoleculerParams } from '../../../../src';

describe('IsDate', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsDate()
      prop!: Date;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'date' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsDate({ convert: true })
      prop!: Date;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'date', convert: true },
    });
  });
});
