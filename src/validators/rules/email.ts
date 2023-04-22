import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleEmail extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'email';
  /**
   * If true, the validator accepts an empty string ""
   * @default true
   */
  empty?: boolean;
  /**
   * Checker method. Can be quick or precise
   */
  mode?: 'quick' | 'precise';
  /**
   * Minimum value length
   */
  min?: number;
  /**
   * Maximum value length
   */
  max?: number;

  normalize?: boolean;
}

export function IsEmail(options?: RuleEmail): PropertyDecorator {
  return createRuleDecorator<RuleEmail>('email', options);
}
