import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleObjectID extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'objectID';
  /**
   * To inject ObjectID dependency
   */
  ObjectID?: any;
  /**
   * Convert HexStringObjectID to ObjectID
   */
  convert?: boolean | 'hexString';
}

export function IsObjectID(options?: RuleObjectID): PropertyDecorator {
  return createRuleDecorator<RuleObjectID>('objectID', options);
}
