import { ApiRouteSchema } from 'moleculer-web';
import { ActionOptions } from '../service';
import { getMetadata, setMetadata } from '../utils';
import { getValidationSchema } from '../validators';

export interface RouteFullOptions extends ActionOptions {
  route: ApiRouteSchema['aliases']['s'];
}

export interface RouteOptions extends ActionOptions {
  path: string;
}

export function MoleculerRoute(options?: RouteFullOptions): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;

    if (!handler || typeof handler !== 'function') {
      throw new TypeError('An action must be a function');
    }

    const keyName = propertyKey.toString();
    const routes = getMetadata(target, 'routes', 'api') || {};

    const defaults: RouteFullOptions = {
      name: keyName,
      visibility: 'published',
      route: { type: 'call', method: 'GET', path: '/' },
    };

    const opts: RouteFullOptions = { ...defaults, ...options };
    if (opts.params) opts.params = getValidationSchema(opts.params);

    routes[opts.name] = { handler, ...opts };

    setMetadata(target, 'routes', routes, 'api');
    return descriptor;
  };
}

function createRoute(method: string, options?: RouteOptions): MethodDecorator {
  const { path, ...otherOptions } = options;
  return MoleculerRoute({ route: `${method} ${path}`, ...otherOptions });
}

export function MoleculerRouteGet(options?: RouteOptions): MethodDecorator {
  return createRoute('GET', options);
}

export function MoleculerRoutePost(options?: RouteOptions): MethodDecorator {
  return createRoute('POST', options);
}

export function MoleculerRoutePut(options?: RouteOptions): MethodDecorator {
  return createRoute('PUT', options);
}

export function MoleculerRouteDelete(options?: RouteOptions): MethodDecorator {
  return createRoute('DELETE', options);
}

export function MoleculerRoutePatch(options?: RouteOptions): MethodDecorator {
  return createRoute('PATCH', options);
}
