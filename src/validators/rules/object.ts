import { getTypes } from '../../utils';
import { RuleCustom, StrictMode, ValidationSchema } from '../types';
import { getValidationSchema, updateValidationSchema } from '../validators';

export interface RuleObject<T = any> extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'object';
  /**
   * If `true` any properties which are not defined on the schema will throw an error.<br>
   * If `remove` all additional properties will be removed from the original object. It's a sanitizer, it will change the original object.
   * @default false
   */
  strict?: StrictMode;
  /**
   * List of properties that should be validated by this rule
   */
  properties?: ValidationSchema;
  props?: ValidationSchema;
  /**
   * If set to a number, will throw if the number of props is less than that number.
   */
  minProps?: number;
  /**
   * If set to a number, will throw if the number of props is greater than that number.
   */
  maxProps?: number;

  /**
   * The object to validate
   */
  object?: T;
}

export function IsObject(options?: RuleObject): PropertyDecorator {
  return (target: any, key: string | symbol): any => {
    const t = options?.object || getTypes(target, key);

    if (options?.object) delete options.object;

    const props = getValidationSchema(t);
    const strict = props.$$strict || false;

    delete props.$$strict;
    delete props.$$async;

    updateValidationSchema(target, key, { ...options, props, strict, type: 'object' });
  };
}
