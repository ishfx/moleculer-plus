import {
  ActionCacheOptions,
  ActionHooks,
  ActionVisibility,
  BrokerCircuitBreakerOptions,
  BulkheadOptions,
  FallbackHandler,
  RestSchema,
  RetryPolicyOptions,
  Service,
  TracingActionOptions,
} from 'moleculer';
import { getMetadata, setMetadata } from '../utils';
import { getValidationSchema } from '../validators';

export interface ActionOptions {
  name?: string;
  rest?: RestSchema | string | string[];
  visibility?: ActionVisibility;
  params?: { prototype: any };
  service?: Service;
  cache?: boolean | ActionCacheOptions;
  timeout?: number;
  tracing?: boolean | TracingActionOptions;
  bulkhead?: BulkheadOptions;
  circuitBreaker?: BrokerCircuitBreakerOptions;
  retryPolicy?: RetryPolicyOptions;
  fallback?: string | FallbackHandler;
  hooks?: ActionHooks;

  [key: string]: any;
}

export function MoleculerAction(options?: ActionOptions): MethodDecorator {
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
    const actions = getMetadata(target, 'actions', 'service') || {};

    const defaults: ActionOptions = {
      name: keyName,
      visibility: 'public',
    };

    const opts: ActionOptions = { ...defaults, ...options };
    if (opts.params) opts.params = getValidationSchema(opts.params);

    actions[opts.name] = { handler, ...opts };

    setMetadata(target, 'actions', actions, 'service');
    return descriptor;
  };
}
