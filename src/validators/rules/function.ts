import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleFunction extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'function';
}

export function IsFunction(options?: RuleFunction): PropertyDecorator {
  return createRuleDecorator<RuleFunction>('function', options);
}
