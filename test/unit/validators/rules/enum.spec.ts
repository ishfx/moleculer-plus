import { getValidationSchema, IsEnum, MoleculerParams } from '../../../../src';

describe('IsEnum', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsEnum()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'enum', values: [] },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsEnum({ optional: true, values: [] })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'enum', optional: true, values: [] },
    });
  });

  it('Should use real enums', () => {
    enum TestEnum {
      TEST1 = 'TEST1',
      TEST2 = 'TEST2',
    }

    @MoleculerParams()
    class Test {
      @IsEnum({ enum: TestEnum, optional: true })
      prop!: TestEnum;
    }

    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'enum', optional: true, values: ['TEST1', 'TEST2'] },
    });
  });
});
