import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleBoolean extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'boolean';
  /**
   * if true and the type is not Boolean, try to convert. 1, "true", "1", "on" will be true. 0, "false", "0", "off" will be false.
   * @default false
   */
  convert?: boolean;
}

export function IsBoolean(options?: RuleBoolean): PropertyDecorator {
  return createRuleDecorator<RuleBoolean>('boolean', options);
}
