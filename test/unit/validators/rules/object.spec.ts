import { getValidationSchema, IsBoolean, IsObject, MoleculerParams } from '../../../../src';

describe('IsObject', () => {
  it('Should apply defaults', () => {
    @MoleculerParams()
    class Test {
      @IsObject()
      prop!: any;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: 'object', strict: false, props: {} },
    });
  });

  it('Should apply nested schema', () => {
    @MoleculerParams({ strict: true })
    class NestedTest {
      @IsBoolean({ optional: true })
      prop?: boolean;
    }
    @MoleculerParams()
    class Test {
      @IsObject({ optional: true })
      prop?: NestedTest;
    }
    expect(getValidationSchema(Test)).toEqual({
      $$strict: false,
      prop: {
        type: 'object',
        strict: true,
        optional: true,
        props: {
          prop: {
            type: 'boolean',
            optional: true,
          },
        },
      },
    });
  });

  it('Should not remove nested $$strict', () => {
    @MoleculerParams()
    class NestedTest {
      @IsBoolean()
      prop!: boolean;
    }

    expect(getValidationSchema(NestedTest)).toEqual({
      $$strict: false,
      prop: { type: 'boolean' },
    });
  });
});
