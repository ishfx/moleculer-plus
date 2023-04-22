import { Service, ServiceBroker, ServiceSchema } from 'moleculer';
import {
  getServiceSchema,
  MoleculerAction,
  MoleculerMethod,
  MoleculerService,
  MoleculerServiceCreated,
} from '../../../src';

describe('Service decorator', () => {
  it('should pass', () => {
    const defClass = () => {
      @MoleculerService()
      class Test extends Service {}
      return Test;
    };
    expect(defClass).not.toThrow(TypeError);
  });

  it('should not allow non-sevice classes', () => {
    const defClass = () => {
      class BaseTest {}

      // @ts-ignore
      @MoleculerService()
      class ErrorTest extends BaseTest {}

      return ErrorTest;
    };
    expect(defClass).toThrow(TypeError);
  });

  it('should allow options', () => {
    const defClass = () => {
      class Base extends Service {}

      @MoleculerService({ name: 'Tester' })
      class HelpTest extends Base {
        constructor(broker: ServiceBroker, schema?: ServiceSchema) {
          super(broker, schema);
        }
      }
      return new HelpTest(new ServiceBroker({ logger: false }));
    };
    expect(defClass).not.toThrow(TypeError);
    const test = defClass();
    expect(test).toHaveProperty('name', 'Tester');
  });

  it('should allow mixins', () => {
    const defClass = () => {
      class Mixin1 extends Service {
        @MoleculerAction({ name: 'testAction' })
        test() {
          return true;
        }

        @MoleculerServiceCreated()
        created1() {}
      }

      @MoleculerService({
        settings: { abc: 123 },
      })
      class Mixin2 extends Service {
        @MoleculerServiceCreated()
        created2() {}
      }

      @MoleculerService({ name: 'Tester', mixins: [Mixin1, Mixin2] })
      class Test extends Service {
        constructor(broker: ServiceBroker, schema?: ServiceSchema) {
          super(broker, schema);
        }
      }
      return new Test(new ServiceBroker({ logger: false }));
    };

    expect(defClass).not.toThrow(TypeError);

    const test = defClass();
    expect(test).toHaveProperty('name', 'Tester');
    expect(test.schema).toStrictEqual({
      name: 'Tester',
      settings: {
        abc: 123,
      },
      actions: {
        testAction: {
          handler: expect.any(Function),
          name: 'testAction',
          visibility: 'public',
        },
      },
      created: [expect.any(Function), expect.any(Function)],
      mixins: [
        {
          actions: {
            testAction: {
              handler: expect.any(Function),
              name: 'testAction',
              visibility: 'public',
            },
          },
          created: expect.any(Function),
        },
        {
          created: expect.any(Function),
          name: 'Mixin2',
          settings: {
            abc: 123,
          },
        },
      ],
    });
  });

  it('should allow methods', () => {
    @MoleculerService({ name: 'Tester' })
    class Test extends Service {
      @MoleculerMethod()
      testMethod(test: string) {
        return test;
      }

      @MoleculerMethod()
      async testMethod2(test: string) {
        return test;
      }
    }

    expect(getServiceSchema(Test)).toStrictEqual({
      name: 'Tester',
      methods: {
        testMethod: {
          handler: expect.any(Function),
        },
        testMethod2: {
          handler: expect.any(Function),
        },
      },
    });
  });
});
