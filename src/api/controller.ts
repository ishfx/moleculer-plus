import { ActionSchema, ServiceSchema, ServiceSettingSchema } from 'moleculer';
import { ApiRouteSchema, ApiSettingsSchema } from 'moleculer-web';
import { join } from 'path';
import {
  ServiceConstructor,
  ServiceDecorator,
  ServiceOptions,
  convertServiceMixins,
  isServiceClass,
} from '../service';
import { cleanRoutePath, getMetadata, getMetadataKeys, setMetadata } from '../utils';
import { RouteFullOptions } from './route';

export type ControllerOptions<S = ServiceSettingSchema> = ApiRouteSchema & {
  controllers?: Array<ServiceConstructor>;
  service?: ServiceOptions<S>;
};

export function getControllerInnerSchema(
  constructor: ServiceConstructor
): Partial<ServiceSchema<ApiSettingsSchema>> {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  // get routes
  const routes: Record<string, RouteFullOptions> =
    getMetadata(constructor.prototype, 'routes', 'api') || {};

  const aliases: ApiRouteSchema['aliases'] = {};
  const actions: ActionSchema = {};

  for (const [key, handler] of Object.entries(routes)) {
    // create alias
    const { route, ...props } = handler;
    if (Array.isArray(route) || typeof route === 'function') {
      // ignore
    } else if (typeof route === 'string') {
      aliases[route] = props.name;
    } else {
      aliases[`${route.method} ${route.path}`] = { ...route, action: props.name };
    }

    // create action
    actions[key] = props;
  }

  // get controller middlewares
  const middlewares: ApiRouteSchema['use'] = getMetadata(
    constructor.prototype,
    'middlewares',
    'api'
  );

  // get controller on call events handlers
  const onCallHandlers: ApiRouteSchema = getMetadata(constructor.prototype, 'hooks', 'api') || {};

  // init service schema with routes data
  const serviceSchema: Partial<ServiceSchema<ApiSettingsSchema>> = {
    settings: {
      routes: [
        {
          path: '/',
          aliases,
          use: middlewares,
          ...onCallHandlers,
        },
      ],
    },
    actions,
  };

  // get other moleculer elements
  const keys = getMetadataKeys(constructor.prototype, 'service');
  keys.forEach(({ key, metadata }) => {
    serviceSchema[key] = key === 'actions' ? { ...metadata, ...actions } : metadata;
  });

  return serviceSchema;
}

export function getControllerSchema(
  constructor: ServiceConstructor
): ServiceSchema<ApiSettingsSchema> {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  return (
    getMetadata(constructor.prototype, 'controller', 'api') || getControllerInnerSchema(constructor)
  );
}

export function getRoutesForApi(controllers: ServiceConstructor[], apiSchemaName: string) {
  const routes: ApiRouteSchema[] = [];
  const mixins: Partial<ServiceSchema<ApiSettingsSchema>>[] = [];

  controllers.forEach((controller) => {
    const convertedRoute = convertControllersToRoute([controller], false);
    if (!convertedRoute) return;

    const { route } = convertedRoute;
    Object.entries(route.aliases).forEach(([routeKey, routeHandler]) => {
      if (Array.isArray(routeHandler) || typeof routeHandler === 'function') {
        // TODO: handle this case
      } else if (typeof routeHandler === 'string') {
        route.aliases[routeKey] = `${apiSchemaName}.${routeHandler}`;
      } else {
        route.aliases[routeKey] = {
          ...routeHandler,
          action: `${apiSchemaName}.${routeHandler.action}`,
        };
      }
    });

    routes.push(convertedRoute.route);
    mixins.push(...convertedRoute.mixins);
  });

  return {
    routes,
    mixins,
  };
}

export function convertControllersToRoute(
  rawControllers: ServiceConstructor[],
  mergePath: boolean = true
) {
  if (!rawControllers) return;

  // convert nested controllers to schemas
  const convertControllers = (controllersToConvert: Array<ServiceConstructor>) => {
    return controllersToConvert.map((controller) => {
      const convertedControllers = isServiceClass(controller)
        ? getControllerSchema(controller)
        : controller;

      if (convertedControllers.controllers) {
        convertedControllers.controllers = convertControllers(convertedControllers.controllers);
      }

      return convertedControllers;
    });
  };

  const controllers = convertControllers(rawControllers);

  // convert controllers schemas to mixins
  let route: ApiRouteSchema = { path: '/', aliases: {} };
  const mixins: Partial<ServiceSchema<ApiSettingsSchema>>[] = [];
  controllers.forEach((controller) => {
    const { settings, ...controllerMixin } = controller;

    // prefix service name to all actions
    const handleActionsMixin = (service: Partial<ServiceSchema>, parentName?: string) => {
      if (service.mixins) {
        service.mixins.forEach((mixin) => handleActionsMixin(mixin, controllerMixin.name));
      }

      if (service.actions) {
        Object.entries(service.actions).forEach(([actionKey, actionHandler]) => {
          if (['boolean', 'function'].includes(typeof actionHandler)) return;

          const action = actionHandler as ActionSchema;
          const prefixName = parentName ?? service.name;

          action.name = `${prefixName}.${action.name}`;
          service.actions[`${prefixName}.${actionKey}`] = action;
          delete service.actions[actionKey];
        });
      }
    };

    handleActionsMixin(controllerMixin);

    // get controller route
    let controllerRoutes: ApiRouteSchema[] = [];
    if (settings) {
      const { routes, ...controllerMixinSettings } = settings;

      controllerRoutes = routes;
      controllerMixin.settings = controllerMixinSettings;
    }

    // add to mixins
    mixins.push(controllerMixin);

    if (!mergePath && controllerRoutes.length > 1) {
      throw new Error('Cant merge path if there are multiple routes');
    }

    // convert routes to aliases
    controllerRoutes.forEach((controllerRoute) => {
      if (!mergePath) {
        // single iteration, no rewrite here
        route = { ...route, ...controllerRoute };
      }

      Object.entries(controllerRoute.aliases).forEach(([routeKey, routeHandler]) => {
        // prefix controller route path to aliases
        let newRouteKey = routeKey;
        let newPath = routeKey;

        if (routeKey.includes(' ')) {
          const [method, routePath] = routeKey.split(' ');
          newPath = mergePath ? join(controllerRoute.path, routePath) : routePath;
          newRouteKey = `${method} ${newPath}`;
        } else {
          newPath = join(controllerRoute.path, routeKey);
          newRouteKey = mergePath ? newPath : routeKey;
        }

        // prefix controller service name to aliases actions
        if (Array.isArray(routeHandler) || typeof routeHandler === 'function') {
          // TODO: handle this case
        } else if (typeof routeHandler === 'string') {
          route.aliases[newRouteKey] = `${controllerMixin.name}.${routeHandler}`;
        } else {
          route.aliases[newRouteKey] = {
            ...routeHandler,
            path: newPath,
            action: `${controllerMixin.name}.${routeHandler.action}`,
          };
        }
      });
    });
  });

  return {
    route,
    mixins,
  };
}

export function mergeControllerRoutes(
  schema: ServiceSchema<ApiSettingsSchema>,
  options: Omit<ControllerOptions, 'service'>
) {
  const { controllers, ...controllerRouteOptions } = options;

  // set controller route schema from options
  const [innerControllerRoute] = schema.settings.routes;
  const defaultControllerRoute: Partial<ApiRouteSchema> = { mappingPolicy: 'restrict' };

  const controllerRoute: ApiRouteSchema = {
    ...innerControllerRoute,
    ...defaultControllerRoute,
    ...controllerRouteOptions,
  };

  // convert controllers to route
  if (controllers) {
    const { mixins, route } = convertControllersToRoute(controllers);
    schema.mixins = Array.isArray(schema.mixins) ? [...schema.mixins, ...mixins] : mixins;

    // there is only one route
    controllerRoute.aliases = {
      ...controllerRoute.aliases,
      ...route.aliases,
    };
  }

  schema.settings.routes = [controllerRoute];
}

export function MoleculerController<S = ServiceSettingSchema>(
  options?: ControllerOptions<S>
): ServiceDecorator {
  return <T extends ServiceConstructor>(constructor: T) => {
    if (!isServiceClass(constructor)) {
      throw TypeError('Class must extend Service');
    }

    const cachedSchema: ServiceSchema = getMetadata(constructor.prototype, 'controller', 'api');
    if (cachedSchema) {
      return constructor;
    }

    // get controller default name from path
    let defaultName: string = cleanRoutePath(options.path).replaceAll('/', '.');
    if (defaultName.startsWith('.')) {
      defaultName = defaultName.substring(1);
    }

    const { service, ...controllerOptions } = options;

    // prepare defaults
    const defaults: ServiceSchema<ApiSettingsSchema> = {
      name: defaultName,
      ...service,
    };

    const { settings: defaultSettings, ...defaultSchema } = defaults;
    const { settings, ...innerSchema } = getControllerInnerSchema(constructor);

    // get schema
    const schema: ServiceSchema<ApiSettingsSchema> = {
      ...defaultSchema,
      ...innerSchema,
      settings: { ...defaultSettings, ...settings },
    };

    // convert mixins
    convertServiceMixins(schema);

    // set controller route schema from options
    mergeControllerRoutes(schema, controllerOptions);

    setMetadata(constructor.prototype, 'controller', schema, 'api');
    return constructor;
  };
}
