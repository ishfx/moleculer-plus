import { ApiRouteSchema } from 'moleculer-web';
import { getMetadata, setMetadata } from '../utils';

export function MoleculerControllerMiddleware(): MethodDecorator {
  return <T>(
    target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;

    if (!handler || typeof handler !== 'function') {
      throw new TypeError('A method must be a function');
    }

    const middlewares: ApiRouteSchema['use'] = getMetadata(target, 'middlewares', 'api') || [];
    middlewares.push(handler as any);

    setMetadata(target, 'middlewares', middlewares, 'api');
    return descriptor;
  };
}
