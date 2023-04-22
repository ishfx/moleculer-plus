import { ApiRouteSchema } from 'moleculer-web';
import { getMetadata, setMetadata } from '../utils';

export function MoleculerApiHook(): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;

    if (!handler || typeof handler !== 'function') {
      throw new TypeError('A method must be a function');
    }

    const keyName = propertyKey.toString();

    if (!['onAfterCall', 'onBeforeCall', 'onError'].includes(keyName)) {
      throw new TypeError(
        'Controller on call method name must be one of: onAfterCall,onBeforeCall,onError'
      );
    }

    const onCallHandlers: ApiRouteSchema = getMetadata(target, 'hooks', 'api') || {};
    onCallHandlers[keyName] = handler;

    setMetadata(target, 'hooks', onCallHandlers, 'api');
    return descriptor;
  };
}
