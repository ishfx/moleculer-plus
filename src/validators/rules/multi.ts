import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleMulti extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'multi';

  rules: RuleCustom[] | string[];
}

export function IsMulti(options?: RuleMulti): PropertyDecorator {
  return createRuleDecorator<RuleMulti>('multi', options);
}
