import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleDate extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'date';
  /**
   * if true and the type is not Date, try to convert with new Date()
   * @default false
   */
  convert?: boolean;
}

export function IsDate(options?: RuleDate): PropertyDecorator {
  return createRuleDecorator<RuleDate>('date', options);
}
