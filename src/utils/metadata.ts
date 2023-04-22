import 'reflect-metadata';
import { deepClone } from './helpers';

export const META_PREFIX: string = 'moleculer:decorators';

function isKey(key: string, scope: string = '') {
  return typeof key === 'string' && key.startsWith(`${META_PREFIX}${scope}:`);
}

function prefixKey(key: string, scope: string = '') {
  if (!isKey(key, scope)) {
    return `${META_PREFIX}${scope}:${key}`;
  }

  return key;
}

export function getMetadataKeys(target: any, scope: string = '') {
  const keys = Reflect.getMetadataKeys(target) || [];

  const metadataKeys: { key: string; metadata: any }[] = [];
  keys.forEach((key) => {
    if (isKey(key, scope)) {
      metadataKeys.push({
        key: key.replace(new RegExp(`^${META_PREFIX}${scope}:`), ''),
        metadata: getMetadata(target, key, scope),
      });
    }
  });

  return metadataKeys;
}

export function getMetadata(target: any, key: string, scope: string = '') {
  return deepClone(Reflect.getMetadata(prefixKey(key, scope), target));
}

export function setMetadata(target: any, key: string, value: any, scope: string = '') {
  Reflect.defineMetadata(prefixKey(key, scope), value, target);
}

export function removeMetadata(target: any, key: string, scope: string = '') {
  return Reflect.deleteMetadata(prefixKey(key, scope), target);
}

export function getOwnMetadata(target: any, key: string, scope: string = '') {
  return deepClone(Reflect.getOwnMetadata(prefixKey(key, scope), target));
}

export function setCache(target: any, key: string, value: any) {
  setMetadata(target, key, value, 'cache');
}

export function getCache(target: any, key: string) {
  return getMetadata(target, key, 'cache');
}

export function getTypes(target: any, key: string | symbol) {
  return Reflect.getMetadata('design:type', target, key);
}
