import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleLuhn extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'luhn';
}

export function IsLuhn(options?: RuleLuhn): PropertyDecorator {
  return createRuleDecorator<RuleLuhn>('luhn', options);
}
