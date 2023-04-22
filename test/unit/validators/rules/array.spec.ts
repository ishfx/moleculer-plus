import { getValidationSchema, IsArray, IsDate, IsNumber, MoleculerParams } from '../../../../src';

describe('IsArray', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsArray()
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'array' },
    });
  });

  it('Should apply passed options', () => {
    @MoleculerParams()
    class Test {
      @IsArray({ optional: true })
      prop!: string;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'array', optional: true },
    });
  });

  it('Should apply objects', () => {
    @MoleculerParams({ strict: true })
    class TestObject {
      @IsDate()
      prop1!: Date;

      @IsNumber({ positive: true })
      prop2!: number;
    }

    class Test {
      @IsArray({ optional: true, object: TestObject })
      prop!: TestObject[];
    }
    expect(getValidationSchema(Test)).toEqual({
      prop: {
        type: 'array',
        optional: true,
        items: {
          type: 'object',
          strict: true,
          props: {
            prop1: { type: 'date' },
            prop2: { type: 'number', positive: true },
          },
        },
      },
    });
  });
});
