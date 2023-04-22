import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleClass<T = any> extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'class';
  /**
   * Checked Class
   */
  instanceOf?: T;
}

export function IsClass<T = any>(options?: RuleClass<T>): PropertyDecorator {
  return createRuleDecorator<RuleClass<T>>('class', options);
}
