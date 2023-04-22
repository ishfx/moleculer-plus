import { ServiceSchema } from 'moleculer';
import ApiMixin, { ApiSettingsSchema } from 'moleculer-web';
import {
  ServiceConstructor,
  ServiceDecorator,
  ServiceOptions,
  convertServiceMixins,
  isServiceClass,
} from '../service';
import { getMetadata, getMetadataKeys, setMetadata } from '../utils';
import { getRoutesForApi } from './controller';

export type ApiOptions = ServiceOptions<ApiSettingsSchema> & {
  controllers?: Array<ServiceConstructor>;
};

export function getApiInnerSchema(
  constructor: ServiceConstructor
): Partial<ServiceSchema<ApiSettingsSchema>> {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  // get controller middlewares
  const middlewares: ApiSettingsSchema['use'] = getMetadata(
    constructor.prototype,
    'middlewares',
    'api'
  );

  // get controller on call events handlers
  const onCallHandlers: ApiSettingsSchema =
    getMetadata(constructor.prototype, 'hooks', 'api') || {};

  // init service schema with routes data
  const serviceSchema: Partial<ServiceSchema<ApiSettingsSchema>> = {
    settings: {
      use: middlewares,
      ...onCallHandlers,
    },
  };

  // get other moleculer elements
  const keys = getMetadataKeys(constructor.prototype, 'service');
  keys.forEach(({ key, metadata }) => (serviceSchema[key] = metadata));

  return serviceSchema;
}

export function getApiSchema(constructor: ServiceConstructor): ServiceSchema<ApiSettingsSchema> {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  return getMetadata(constructor.prototype, 'schema', 'service') || getApiInnerSchema(constructor);
}

export function convertControllersToRoutes(
  schema: ServiceSchema<ApiSettingsSchema>,
  controllers: ServiceConstructor[]
) {
  if (!controllers) return;

  // convert controllers to routes and mixins
  const { routes, mixins } = getRoutesForApi(controllers, schema.name);

  schema.settings.routes = routes;
  schema.mixins = schema.mixins ? [...schema.mixins, ...mixins] : mixins;
}

export function MoleculerApi(options?: ApiOptions): ServiceDecorator {
  return <T extends ServiceConstructor>(constructor: T) => {
    if (!isServiceClass(constructor)) {
      throw TypeError('Class must extend Service');
    }

    let schema: ServiceSchema = getMetadata(constructor.prototype, 'schema', 'service');

    if (!schema) {
      const { controllers, ...apiOptions } = options;

      const defaults: ServiceSchema = {
        name: constructor.name,
        mixins: [ApiMixin],
        ...apiOptions,
      };

      const { settings: defaultSettings, ...defaultSchema } = defaults;
      const { settings, ...innerSchema } = getApiInnerSchema(constructor);

      // get schema
      schema = {
        ...defaultSchema,
        ...innerSchema,
        settings: { ...defaultSettings, ...settings },
      };

      // convert mixins
      convertServiceMixins(schema);

      // convert controllers
      convertControllersToRoutes(schema, controllers);

      setMetadata(constructor.prototype, 'schema', schema, 'service');
    }

    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        this.parseServiceSchema(schema);
      }
    };
  };
}
