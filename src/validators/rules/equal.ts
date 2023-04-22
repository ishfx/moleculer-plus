import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleEqual<T = any> extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'equal';
  /**
   * The valid value
   */
  value?: T;

  /**
   * Another field name
   */
  field?: string;

  /**
   * Strict value checking.
   *
   * @type {'boolean'}
   * @memberof RuleEqual
   */
  strict?: boolean;
}

export function IsEqual<T = any>(options?: RuleEqual<T>): PropertyDecorator {
  return createRuleDecorator<RuleEqual<T>>('equal', options);
}
