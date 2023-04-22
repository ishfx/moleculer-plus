import { Service } from 'moleculer';
import {
  MoleculerAction,
  MoleculerApi,
  MoleculerApiHook,
  MoleculerController,
  MoleculerControllerMiddleware,
  MoleculerMethod,
  MoleculerRoute,
  MoleculerRouteGet,
  MoleculerRoutePost,
  getApiSchema,
  getControllerSchema,
} from '../../../src';

describe('Api decorator', () => {
  @MoleculerController({ path: '/test1' })
  class ControllerTest1 extends Service {
    @MoleculerRoute({ name: 'route.1', route: 'GET /route/1/:id' })
    public async testRoute1() {}

    @MoleculerRoute({ route: { method: 'POST', path: '/route/2' } })
    public async testRoute2() {}

    @MoleculerRouteGet({ path: '/route/:id' })
    public async testRoute5() {}

    @MoleculerAction({ name: 'action.1' })
    public async testRoute3() {}

    @MoleculerMethod()
    public async testRoute4() {}
  }

  @MoleculerController({
    path: '/api1',
    controllers: [ControllerTest1],
    bodyParsers: { text: { type: 'application/json' } },
    cors: {
      origin: '*',
      allowedHeaders: '*',
    },
  })
  class ControllerTest2 extends Service {
    @MoleculerRoute({ name: 'route.3', route: 'GET /route/3' })
    public async testRoute1() {}

    @MoleculerMethod()
    public async testRoute500() {}
  }

  @MoleculerController({ path: '/api2', service: { settings: { abc: 'def' } } })
  class ControllerTest3 extends Service {
    @MoleculerRoutePost({ path: '/route/4' })
    public async testRoute1() {}
  }

  @MoleculerController({
    path: '/root',
    controllers: [ControllerTest2, ControllerTest3],
    bodyParsers: { text: { type: 'application/json' } },
    cors: {
      origin: '*',
    },
  })
  class ControllerTest4 extends Service {
    @MoleculerRoute({ name: 'route.5', route: 'GET /route/5' })
    public async testRoute1() {}

    @MoleculerControllerMiddleware()
    public async totoMiddleware() {}

    @MoleculerApiHook()
    public async onAfterCall() {}
  }

  @MoleculerController({
    path: '/api3',
    service: { settings: { def: 'ghi' }, mixins: [{ name: 'test' }] },
  })
  class ControllerTest5 extends Service {
    @MoleculerRoute({ name: 'route.6', route: 'POST /route/6/:name' })
    public async testRoute1() {}
  }

  @MoleculerApi({
    name: 'api',
    controllers: [ControllerTest4, ControllerTest5],
    settings: { path: '/api' },
  })
  class ApiService extends Service {
    @MoleculerApiHook()
    public async onError() {}

    @MoleculerControllerMiddleware()
    public async apiMiddleware() {}
  }

  it('should get controller schema', () => {
    const schema = getControllerSchema(ControllerTest4);
    expect(schema).toEqual({
      name: 'root',
      settings: {
        routes: [
          {
            path: '/root',
            aliases: {
              'GET /api1/route/3': 'api1.route.3',
              'GET /api1/test1/route/1/:id': 'api1.test1.route.1',
              'GET /api1/test1/route/:id': 'api1.test1.testRoute5',
              'GET /route/5': 'route.5',
              'POST /api2/route/4': 'api2.testRoute1',
              'POST /api1/test1/route/2': {
                method: 'POST',
                path: '/api1/test1/route/2',
                action: 'api1.test1.testRoute2',
              },
            },
            bodyParsers: { text: { type: 'application/json' } },
            cors: { origin: '*' },
            mappingPolicy: 'restrict',
            onAfterCall: expect.any(Function),
            use: [expect.any(Function)],
          },
        ],
      },
      actions: {
        'route.5': {
          handler: expect.any(Function),
          name: 'route.5',
          visibility: 'published',
        },
      },
      mixins: [
        {
          actions: {
            'api1.route.3': {
              handler: expect.any(Function),
              name: 'api1.route.3',
              visibility: 'published',
            },
          },
          methods: {
            testRoute500: { handler: expect.any(Function) },
          },
          mixins: [
            {
              actions: {
                'api1.test1.action.1': {
                  handler: expect.any(Function),
                  name: 'api1.test1.action.1',
                  visibility: 'public',
                },
                'api1.test1.route.1': {
                  handler: expect.any(Function),
                  name: 'api1.test1.route.1',
                  visibility: 'published',
                },
                'api1.test1.testRoute2': {
                  handler: expect.any(Function),
                  name: 'api1.test1.testRoute2',
                  visibility: 'published',
                },
                'api1.test1.testRoute5': {
                  handler: expect.any(Function),
                  name: 'api1.test1.testRoute5',
                  visibility: 'published',
                },
              },
              methods: {
                testRoute4: { handler: expect.any(Function) },
              },
              name: 'test1',
              settings: {},
            },
          ],
          name: 'api1',
          settings: {},
        },
        {
          actions: {
            'api2.testRoute1': {
              handler: expect.any(Function),
              name: 'api2.testRoute1',
              visibility: 'published',
            },
          },
          name: 'api2',
          settings: {
            abc: 'def',
          },
        },
      ],
    });
  });

  it('should get api schema', () => {
    const schema = getApiSchema(ApiService);
    expect(schema).toEqual({
      name: 'api',
      settings: {
        onError: expect.any(Function),
        path: '/api',
        routes: [
          {
            aliases: {
              'GET /api1/route/3': 'api.root.api1.route.3',
              'GET /api1/test1/route/1/:id': 'api.root.api1.test1.route.1',
              'GET /api1/test1/route/:id': 'api.root.api1.test1.testRoute5',
              'GET /route/5': 'api.root.route.5',
              'POST /api1/test1/route/2': {
                action: 'api.root.api1.test1.testRoute2',
                method: 'POST',
                path: '/api1/test1/route/2',
              },
              'POST /api2/route/4': 'api.root.api2.testRoute1',
            },
            bodyParsers: { text: { type: 'application/json' } },
            cors: { origin: '*' },
            mappingPolicy: 'restrict',
            onAfterCall: expect.any(Function),
            path: '/root',
            use: [expect.any(Function)],
          },
          {
            aliases: { 'POST /route/6/:name': 'api.api3.route.6' },
            mappingPolicy: 'restrict',
            path: '/api3',
          },
        ],
        use: [expect.any(Function)],
      },
      mixins: [
        expect.any(Object),
        {
          actions: {
            'root.route.5': {
              handler: expect.any(Function),
              name: 'root.route.5',
              visibility: 'published',
            },
          },
          mixins: [
            {
              actions: {
                'root.api1.route.3': {
                  handler: expect.any(Function),
                  name: 'root.api1.route.3',
                  visibility: 'published',
                },
              },
              methods: { testRoute500: { handler: expect.any(Function) } },
              mixins: [
                {
                  actions: {
                    'root.api1.test1.action.1': {
                      handler: expect.any(Function),
                      name: 'root.api1.test1.action.1',
                      visibility: 'public',
                    },
                    'root.api1.test1.route.1': {
                      handler: expect.any(Function),
                      name: 'root.api1.test1.route.1',
                      visibility: 'published',
                    },
                    'root.api1.test1.testRoute2': {
                      handler: expect.any(Function),
                      name: 'root.api1.test1.testRoute2',
                      visibility: 'published',
                    },
                    'root.api1.test1.testRoute5': {
                      handler: expect.any(Function),
                      name: 'root.api1.test1.testRoute5',
                      visibility: 'published',
                    },
                  },
                  methods: { testRoute4: { handler: expect.any(Function) } },
                  name: 'test1',
                  settings: {},
                },
              ],
              name: 'api1',
              settings: {},
            },
            {
              actions: {
                'root.api2.testRoute1': {
                  handler: expect.any(Function),
                  name: 'root.api2.testRoute1',
                  visibility: 'published',
                },
              },
              name: 'api2',
              settings: {
                abc: 'def',
              },
            },
          ],
          name: 'root',
          settings: {},
        },
        {
          actions: {
            'api3.route.6': {
              handler: expect.any(Function),
              name: 'api3.route.6',
              visibility: 'published',
            },
          },
          name: 'api3',
          settings: { def: 'ghi' },
          mixins: [{ name: 'test' }],
        },
      ],
    });
  });
});
