import { getValidationSchema, IsAny, MoleculerParams } from '../../../../src';

describe('IsAny', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsAny()
      prop!: any;
    }
    expect(getValidationSchema(Test)).toEqual({ $$strict: false, prop: { type: 'any' } });
  });
});
