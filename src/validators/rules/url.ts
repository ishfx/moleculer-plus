import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleURL extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'url';
  /**
   * If true, the validator accepts an empty string ""
   * @default true
   */
  empty?: boolean;
}

export function IsURL(options?: RuleURL): PropertyDecorator {
  return createRuleDecorator<RuleURL>('url', options);
}
