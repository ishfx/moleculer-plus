import { getValidationSchema, IsURL, MoleculerParams } from '../../../../src';

describe('IsURL', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsURL()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({ $$strict: false, prop: { type: 'url' } });
  });
});
