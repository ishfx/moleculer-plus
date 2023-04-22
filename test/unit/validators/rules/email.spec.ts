import { getValidationSchema, IsEmail, MoleculerParams } from '../../../../src';

describe('IsEmail', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsEmail()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'email' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsEmail({ optional: true })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'email', optional: true },
    });
  });
});
