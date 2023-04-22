import { getMetadata, setMetadata } from '../utils';

export function MoleculerMethod(): MethodDecorator {
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
    const methods = getMetadata(target, 'methods', 'service') || {};
    methods[keyName] = { handler };

    setMetadata(target, 'methods', methods, 'service');
    return descriptor;
  };
}
