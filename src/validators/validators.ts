import { deepClone, getOwnMetadata, setMetadata } from '../utils';
import { MoleculerParamsOptions, RuleCustom } from './types';

function getPrototypeChain(object: any): any[] {
  let proto = object;
  const protos: unknown[] = [object];

  while (proto) {
    proto = Object.getPrototypeOf(proto);
    if (proto) {
      protos.push(proto);
    }
  }

  return protos;
}

export function getValidationSchema(target: { prototype: any; name?: string }): any {
  const chain = getPrototypeChain(target.prototype);
  const schema: Record<string, any> = {};
  Object.assign(schema, ...chain.map((c) => getOwnMetadata(c, 'params', 'validator')));

  const isObject = (value: any) =>
    !!value && (Object.getPrototypeOf(value) === null || value.constructor === Object);

  let $$async: boolean = false;
  const checkAsync = (obj: Record<string, any>) => {
    for (const [key, value] of Object.entries(obj)) {
      // if nested
      if (isObject(value)) {
        const copyValue = deepClone(value);
        checkAsync(copyValue);
        obj[key] = copyValue;
      }
      // if there is one async
      else if (key === '$$async' && value === true) {
        $$async = true;
        delete obj.$$async;
        break;
      }
    }
  };

  checkAsync(schema);
  if ($$async) schema.$$async = true;

  return schema;
}

export function updateValidationSchema(target: any, key: string | symbol, options: any): void {
  const s = getOwnMetadata(target, 'params', 'validator') ?? {};

  if (Array.isArray(s[key])) {
    s[key].push(options);
  } else if (s[key]) {
    const tmp = s[key];
    s[key] = [tmp, options];
  } else {
    s[key] = options;
  }

  setMetadata(target, 'params', s, 'validator');
}

export function MoleculerParams(options?: MoleculerParamsOptions) {
  return <T extends { new (...args: any[]) }>(target: T) => {
    updateValidationSchema(target.prototype, '$$strict', options?.strict ?? false);
    if (options?.async !== undefined) {
      updateValidationSchema(target.prototype, '$$async', options.async);
    }
  };
}

export function createRuleDecorator<T extends RuleCustom = RuleCustom>(
  type: T['type'],
  options?: Partial<T>,
  defaults?: Partial<T>
): PropertyDecorator {
  return (target: any, key: string | symbol): any => {
    updateValidationSchema(target, key, { ...defaults, ...options, type });
  };
}
