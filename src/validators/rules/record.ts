import { RuleCustom, ValidationRuleObject } from '../types';
import { createRuleDecorator } from '../validators';
import { RuleString } from './string';

export interface RuleRecord extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'record';
  /**
   * Key validation rule
   */
  key?: RuleString;
  /**
   * Value validation rule
   */
  value?: ValidationRuleObject;
}

export function IsRecord(options?: RuleRecord): PropertyDecorator {
  return createRuleDecorator<RuleRecord>('record', options);
}
