import { getValidationSchema, IsObjectID, MoleculerParams } from '../../../../src';

describe('IsObjectID', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsObjectID()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'objectID' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsObjectID({ optional: true })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'objectID', optional: true },
    });
  });
});
