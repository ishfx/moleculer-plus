import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleUUID extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'uuid';
  /**
   * UUID version in range 0-6
   */
  version?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function IsUUID(options?: RuleUUID): PropertyDecorator {
  return createRuleDecorator<RuleUUID>('uuid', options);
}
