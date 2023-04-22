import { RuleCustom, ValidationRule } from '../types';
import { createRuleDecorator, getValidationSchema } from '../validators';

export interface RuleArray<T = any, O extends { prototype: any; name?: string } = any>
  extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'array';
  /**
   * If true, the validator accepts an empty array [].
   * @default true
   */
  empty?: boolean;
  /**
   * Minimum count of elements
   */
  min?: number;
  /**
   * Maximum count of elements
   */
  max?: number;
  /**
   * Fixed count of elements
   */
  length?: number;
  /**
   * The array must contain this element too
   */
  contains?: T | T[];
  /**
   * Every element must be an element of the enum array
   */
  enum?: T[];
  /**
   * Validation rules that should be applied to each element of array
   */
  items?: ValidationRule;

  /**
   * The array must contains this object
   */
  object?: O;
}

export function IsArray<T = any, O extends { prototype: any; name?: string } = any>(
  options?: RuleArray<T, O>
): PropertyDecorator {
  if (options?.object) {
    const props = getValidationSchema(options.object);
    const strict = props.$$strict || false;

    delete props.$$strict;
    delete props.$$async;

    options.items = { type: 'object', strict, props };
    delete options.object;
  }

  return createRuleDecorator<RuleArray<T>>('array', options);
}
