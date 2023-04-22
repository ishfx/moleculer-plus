import { getMetadata, setMetadata } from '../utils';
import { getValidationSchema } from '../validators';

export interface EventOptions {
  name?: string;
  group?: string;
  params?: { prototype: any };
  context?: boolean;
  debounce?: number;
  throttle?: number;
}

export type LifeCycleEventNames = 'created' | 'started' | 'stopped';

export function MoleculerEvent(options?: EventOptions): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;

    if (!handler || typeof handler !== 'function') {
      throw new TypeError('An event handler must be a function');
    }

    const keyName = propertyKey.toString();
    const events = getMetadata(target, 'events', 'service') || {};

    const defaults: EventOptions = {
      name: keyName,
    };

    const opts: EventOptions = { ...defaults, ...options };
    if (opts.params) opts.params = getValidationSchema(opts.params);

    events[opts.name] = { handler, ...opts };

    setMetadata(target, 'events', events, 'service');
    return descriptor;
  };
}

export function createLifeCycleEvent(name: LifeCycleEventNames): MethodDecorator {
  if (!name) {
    throw new ReferenceError('Lifecycle event name required');
  }

  return <T>(
    target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const handler = descriptor.value;

    if (!handler || typeof handler !== 'function') {
      throw new TypeError('An lifecycle event handler must be a function');
    }

    setMetadata(target, name, handler, 'service');
    return descriptor;
  };
}

export function MoleculerServiceCreated(): MethodDecorator {
  return createLifeCycleEvent('created');
}

export function MoleculerServiceStarted(): MethodDecorator {
  return createLifeCycleEvent('started');
}

export function MoleculerServiceStopped(): MethodDecorator {
  return createLifeCycleEvent('stopped');
}
