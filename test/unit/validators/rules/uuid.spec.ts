import { getValidationSchema, IsUUID, MoleculerParams } from '../../../../src';

describe('IsUUID', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsUUID()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'uuid' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsUUID({ optional: true })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'uuid', optional: true },
    });
  });
});
