import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleAny extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'any';
}

export function IsAny(options?: RuleAny): PropertyDecorator {
  return createRuleDecorator<RuleAny>('any', options);
}
