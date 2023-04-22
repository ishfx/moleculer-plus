import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleString extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'string';
  /**
   * If true, the validator accepts an empty string ""
   * @default true
   */
  empty?: boolean;
  /**
   * Minimum value length
   */
  min?: number;
  /**
   * Maximum value length
   */
  max?: number;
  /**
   * Fixed value length
   */
  length?: number;
  /**
   * Regex pattern
   */
  pattern?: string | RegExp;
  /**
   * The value must contain this text
   */
  contains?: string;
  /**
   * The value must be an element of the enum array
   */
  enum?: string[];
  /**
   * The value must be a numeric string
   */
  numeric?: boolean;
  /**
   * The value must be an alphabetic string
   */
  alpha?: boolean;
  /**
   * The value must be an alphanumeric string
   */
  alphanum?: boolean;
  /**
   * The value must be an alphabetic string that contains dashes
   */
  alphadash?: boolean;
  /**
   * The value must be a hex string
   * @default false
   */
  hex?: boolean;
  /**
   * The value must be a singleLine string
   * @default false
   */
  singleLine?: boolean;
  /**
   * The value must be a base64 string
   * @default false
   */
  base64?: boolean;
  /**
   * if true and the type is not a String, converts with String()
   * @default false
   */
  convert?: boolean;

  trim?: boolean;
  trimLeft?: boolean;
  trimRight?: boolean;

  padStart?: number;
  padEnd?: number;
  padChar?: string;

  lowercase?: boolean;
  uppercase?: boolean;
  localeLowercase?: boolean;
  localeUppercase?: boolean;
}

export function IsString(options?: RuleString): PropertyDecorator {
  return createRuleDecorator<RuleString>('string', options, { empty: false });
}
