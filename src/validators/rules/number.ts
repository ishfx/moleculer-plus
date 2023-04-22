import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleNumber extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'number';
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Fixed value
   */
  equal?: number;
  /**
   * Can't be equal to this value
   */
  notEqual?: number;
  /**
   * The value must be a non-decimal value
   * @default false
   */
  integer?: boolean;
  /**
   * The value must be greater than zero
   * @default false
   */
  positive?: boolean;
  /**
   * The value must be less than zero
   * @default false
   */
  negative?: boolean;
  /**
   * if true and the type is not Number, converts with Number()
   * @default false
   */
  convert?: boolean;
}

export function IsNumber(options?: RuleNumber): PropertyDecorator {
  return createRuleDecorator<RuleNumber>('number', options);
}
