import { Service, ServiceBroker, ServiceSchema } from 'moleculer';
import {
  IsEnum,
  IsNumber,
  IsString,
  MoleculerAction,
  MoleculerEvent,
  MoleculerService,
} from '../../../src';

enum TestEnum {
  VALUE1 = 'value1',
  VALUE2 = 'value2',
}

// tslint:disable:max-classes-per-file
// tslint:disable:no-empty
describe('Class decorator', () => {
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

      class HelpRequest {
        @IsString({ min: 2 })
        _text: string;

        @IsNumber({ optional: true })
        _page: number;
      }

      class TestRequest {
        @IsString({ optional: true })
        _testParam: string;

        @IsEnum({ enum: TestEnum })
        _enumParam: TestEnum;
      }

      @MoleculerService({ name: 'Tester' })
      class HelpTest extends Base {
        'constructor'(broker: ServiceBroker, schema?: ServiceSchema) {
          super(broker, schema);
        }
        @MoleculerAction({ params: HelpRequest })
        public 'help'() {}

        @MoleculerAction({ params: TestRequest })
        public 'test'() {}

        @MoleculerEvent()
        public 'test.started'(_payload: any, _sender: string, _eventName: string) {}

        @MoleculerEvent({ name: 'test.ended', group: 'test' })
        public 'testEnded'(_payload: any, _sender: string, _eventName: string) {}
      }
      return new HelpTest(new ServiceBroker({ logger: false }));
    };
    expect(defClass).not.toThrow(TypeError);
    const test = defClass();
    expect(test).toHaveProperty('name', 'Tester');
    expect(test).toHaveProperty('schema');
    expect(test.schema).toHaveProperty('actions');
  });

  it('should allow inheritance', () => {
    const defClass = () => {
      class HelpRequest {
        @IsString({ min: 2 })
        _text: string;

        @IsNumber({ optional: true })
        _page: number;
      }

      class TestRequest {
        @IsString({ optional: true })
        _testParam: string;
      }

      class Base extends Service {
        @MoleculerAction({ params: HelpRequest })
        public help() {}
        @MoleculerAction({ params: TestRequest })
        public test() {}
      }

      @MoleculerService({ name: 'Tester' })
      class HelpTest extends Base {
        @MoleculerEvent({ params: TestRequest })
        public 'test.started'(_payload: any, _sender: string, _eventName: string) {}

        @MoleculerEvent({ name: 'test.ended', group: 'test', params: HelpRequest })
        public 'testEnded'(_payload: any, _sender: string, _eventName: string) {}
      }

      const broker = new ServiceBroker({ logger: false });
      return new HelpTest(broker);
    };
    expect(defClass).not.toThrow(TypeError);
    const test = defClass();

    expect(test.schema).toEqual({
      name: 'Tester',
      actions: {
        help: {
          handler: expect.any(Function),
          name: 'help',
          params: {
            _page: { optional: true, type: 'number' },
            _text: { empty: false, min: 2, type: 'string' },
          },
          visibility: 'public',
        },
        test: {
          handler: expect.any(Function),
          name: 'test',
          params: { _testParam: { empty: false, optional: true, type: 'string' } },
          visibility: 'public',
        },
      },
      events: {
        'test.ended': {
          group: 'test',
          handler: expect.any(Function),
          name: 'test.ended',
          params: {
            _page: { optional: true, type: 'number' },
            _text: { empty: false, min: 2, type: 'string' },
          },
        },
        'test.started': {
          handler: expect.any(Function),
          name: 'test.started',
          params: { _testParam: { empty: false, optional: true, type: 'string' } },
        },
      },
    });
  });
});
