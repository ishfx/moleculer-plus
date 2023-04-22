import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleEnum<T = any> extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'enum';
  /**
   * The valid values
   */
  values?: (T | string)[];

  /**
   * The enum
   */
  enum?: T;
}

export function IsEnum<T = any>(options?: RuleEnum<T>): PropertyDecorator {
  if (options?.enum) {
    options.values = Object.values(options.enum).filter((value) => typeof value === 'string');
    delete options.enum;
  }

  return createRuleDecorator<RuleEnum>('enum', options, { values: [] });
}
