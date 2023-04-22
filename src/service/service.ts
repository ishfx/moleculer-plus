import { Service, ServiceHooks, ServiceSchema, ServiceSettingSchema } from 'moleculer';
import { getMetadata, getMetadataKeys, setMetadata } from '../utils';

/* -------------------------------------------- types ------------------------------------------- */

export interface ServiceDependency {
  name: string;
  version?: string | number;
}

export interface ServiceOptions<S = ServiceSettingSchema> {
  name?: string;
  version?: string | number;
  settings?: S & ServiceSettingSchema;
  dependencies?: string | ServiceDependency | Array<string | ServiceDependency>;
  metadata?: any;
  mixins?: Array<Partial<ServiceSchema> | ServiceConstructor>;
  hooks?: ServiceHooks;

  [name: string]: any;
}

export interface ServiceConstructor {
  new (...args: any[]): Service;
}

export type ServiceDecorator = <T extends ServiceConstructor>(constructor: T) => T;

/* ------------------------------------------- methods ------------------------------------------ */

export function isServiceClass(constructor: any): constructor is ServiceConstructor {
  return typeof constructor === 'function' && Service.isPrototypeOf(constructor);
}

export function getServiceInnerSchema(constructor: ServiceConstructor): Partial<ServiceSchema> {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  const serviceSchema: Partial<ServiceSchema> = {};

  const keys = getMetadataKeys(constructor.prototype, 'service');
  keys.forEach(({ key, metadata }) => (serviceSchema[key] = metadata));

  return serviceSchema;
}

export function getServiceSchema(constructor: ServiceConstructor): ServiceSchema {
  if (!isServiceClass(constructor)) {
    throw TypeError('Class must extend Service');
  }

  return (
    getMetadata(constructor.prototype, 'schema', 'service') || getServiceInnerSchema(constructor)
  );
}

export function convertServiceMixins(schema: ServiceSchema) {
  if (!schema.mixins) return;

  const convertMixins = (mixins: Array<Partial<ServiceSchema> | ServiceConstructor>) => {
    return mixins.map((mixin) => {
      const convertedMixin = isServiceClass(mixin) ? getServiceSchema(mixin) : mixin;
      if (convertedMixin.mixins) {
        convertedMixin.mixins = convertMixins(convertedMixin.mixins);
      }
      return convertedMixin;
    });
  };

  schema.mixins = convertMixins(schema.mixins);
}

export function MoleculerService<S = ServiceSettingSchema>(
  options: ServiceOptions<S> = {}
): ServiceDecorator {
  return <T extends ServiceConstructor>(constructor: T) => {
    if (!isServiceClass(constructor)) {
      throw TypeError('Class must extend Service');
    }

    let schema: ServiceSchema = getMetadata(constructor.prototype, 'schema', 'service');

    if (!schema) {
      // prepare defaults
      const defaults: ServiceSchema = {
        name: constructor.name,
        ...options,
      };

      // get schema
      schema = {
        ...defaults,
        ...getServiceInnerSchema(constructor),
      };

      // convert mixins
      convertServiceMixins(schema);

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
