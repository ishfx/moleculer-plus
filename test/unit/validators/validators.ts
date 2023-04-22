import {
  getValidationSchema,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsObject,
  IsString,
  MoleculerParams,
} from '../../../src';

describe('ValidationSchema', () => {
  it('Should default to not strict', () => {
    @MoleculerParams()
    class Test {}
    expect(getValidationSchema(Test)).toEqual({ $$strict: false });
  });

  it('Should set strict', () => {
    @MoleculerParams({ strict: true })
    class Test {}
    expect(getValidationSchema(Test)).toEqual({ $$strict: true });
  });

  it('Should remove extra properties', () => {
    @MoleculerParams({ strict: 'remove' })
    class Test {
      @IsString()
      prop!: string;
    }

    expect(getValidationSchema(Test)).toEqual({
      $$strict: 'remove',
      prop: { type: 'string', empty: false },
    });
  });

  it('should preserve the constructor name on instancies', () => {
    @MoleculerParams()
    class Test {
      @IsString()
      prop!: string;
      prop2!: string;
    }
    const t = new Test();
    expect(t.constructor.name).toEqual('Test');
  });

  it('Should return schema', () => {
    @MoleculerParams()
    class Test {
      @IsEmail()
      prop!: string;
    }

    expect(getValidationSchema(Test)).toStrictEqual({
      $$strict: false,
      prop: {
        type: 'email',
      },
    });
  });
});

describe('Extending schemas', () => {
  test('Does not mix up inherited properties in schema', () => {
    @MoleculerParams()
    class A {
      @IsString()
      a!: string;
    }

    @MoleculerParams()
    class B extends A {
      @IsString()
      b!: string;
    }

    @MoleculerParams()
    class C extends B {
      @IsString()
      c!: string;
    }

    expect(getValidationSchema(A)).toEqual({
      a: { type: 'string', empty: false },
      $$strict: false,
    });
    expect(getValidationSchema(B)).toEqual({
      b: { type: 'string', empty: false },
      a: { type: 'string', empty: false },
      $$strict: false,
    });
    expect(getValidationSchema(C)).toEqual({
      c: { type: 'string', empty: false },
      a: { type: 'string', empty: false },
      $$strict: false,
      b: { type: 'string', empty: false },
    });
  });

  test('IsObject does not pollute parents', () => {
    @MoleculerParams()
    class A {
      @IsString()
      a!: string;
    }

    @MoleculerParams({ strict: true })
    class Nest {
      @IsString()
      s!: string;

      @IsArray()
      sr!: string;
    }

    @MoleculerParams()
    class B extends A {
      @IsString()
      b!: string;
      @IsObject()
      nest!: Nest;
    }

    expect(getValidationSchema(A)).toEqual({
      a: { type: 'string', empty: false },
      $$strict: false,
    });
    expect(getValidationSchema(Nest)).toEqual({
      s: { type: 'string', empty: false },
      sr: { type: 'array' },
      $$strict: true,
    });
    expect(getValidationSchema(B)).toEqual({
      b: { type: 'string', empty: false },
      a: { type: 'string', empty: false },
      nest: {
        props: { s: { type: 'string', empty: false }, sr: { type: 'array' } },
        strict: true,
        type: 'object',
      },
      $$strict: false,
    });
  });
});

describe('Multiple decorators', () => {
  it('Should apply multiple decorators', () => {
    class Test {
      @IsNumber({ optional: true })
      @IsString({ base64: true })
      prop!: number | string;

      @IsDate()
      prop2!: Date;
    }
    expect(getValidationSchema(Test)).toEqual({
      prop: [
        { type: 'string', base64: true, empty: false },
        { type: 'number', optional: true },
      ],

      prop2: { type: 'date' },
    });
  });

  it('Should apply multiple decorators on object', () => {
    class TestObject {
      @IsDate()
      @IsString({ empty: true })
      prop1!: Date | string;
    }
    class Test {
      @IsNumber({ optional: true })
      @IsObject({ object: TestObject })
      prop!: TestObject | number;
    }
    expect(getValidationSchema(Test)).toEqual({
      prop: [
        {
          type: 'object',
          strict: false,
          props: {
            prop1: [{ type: 'string', empty: true }, { type: 'date' }],
          },
        },
        { type: 'number', optional: true },
      ],
    });
  });

  it('Should apply multiple decorators on arrays', () => {
    @MoleculerParams({ strict: true })
    class TestObject {
      @IsDate()
      @IsBoolean({ nullable: true })
      prop1!: Date | boolean;

      @IsNumber({ positive: true })
      prop2!: number;
    }

    class Test {
      @IsArray({ optional: true, object: TestObject })
      @IsObject({ object: TestObject })
      @IsString({ contains: 'hello' })
      prop!: string | TestObject | TestObject[];
    }

    expect(getValidationSchema(Test)).toEqual({
      prop: [
        { type: 'string', contains: 'hello', empty: false },
        {
          type: 'object',
          strict: true,
          props: {
            prop1: [{ type: 'boolean', nullable: true }, { type: 'date' }],
            prop2: { type: 'number', positive: true },
          },
        },
        {
          type: 'array',
          optional: true,
          items: {
            type: 'object',
            strict: true,
            props: {
              prop1: [{ type: 'boolean', nullable: true }, { type: 'date' }],
              prop2: { type: 'number', positive: true },
            },
          },
        },
      ],
    });
  });
});

describe('Nested async', () => {
  test('Should apply async', () => {
    @MoleculerParams({ strict: true })
    class Nest {
      @IsString()
      s!: string;

      @IsArray({ $$async: true })
      sr!: string;
    }

    @MoleculerParams()
    class A {
      @IsString()
      b!: string;
      @IsObject()
      nest!: Nest;
    }

    expect(getValidationSchema(A)).toEqual({
      $$strict: false,
      b: { empty: false, type: 'string' },
      nest: {
        props: { s: { empty: false, type: 'string' }, sr: { type: 'array' } },
        strict: true,
        type: 'object',
      },
    });

    expect(getValidationSchema(Nest)).toEqual({
      $$async: true,
      $$strict: true,
      s: { empty: false, type: 'string' },
      sr: { type: 'array' },
    });
  });
});
