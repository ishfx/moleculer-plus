import { RuleCustom, ValidationRule } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleTuple extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'tuple';
  /**
   * Validation rules that should be applied to the corresponding element of array
   */
  items?: [ValidationRule, ValidationRule];
}

export function IsTuple(options?: RuleTuple): PropertyDecorator {
  return createRuleDecorator<RuleTuple>('tuple', options);
}
