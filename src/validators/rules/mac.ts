import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleMac extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'mac';
}

export function IsMac(options?: RuleMac): PropertyDecorator {
  return createRuleDecorator<RuleMac>('mac', options);
}
