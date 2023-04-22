import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleCurrency extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'currency';
  /**
   * The currency symbol expected in string (as prefix)
   * @default null
   */
  currencySymbol?: string;
  /**
   * Toggle to make the currency symbol optional in string
   * @default false
   */
  symbolOptional?: boolean;
  /**
   * Thousand place separator character
   * @default ','
   */
  thousandSeparator?: string;
  /**
   * Decimal place character
   * @default '.'
   */
  decimalSeparator?: string;
  /**
   * Custom regular expression to validate currency strings
   */
  customRegex?: RegExp | string;
}

export function IsCurrency(options?: RuleCurrency): PropertyDecorator {
  return createRuleDecorator<RuleCurrency>('currency', options);
}
