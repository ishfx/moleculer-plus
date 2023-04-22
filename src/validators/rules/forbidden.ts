import { RuleCustom } from '../types';
import { createRuleDecorator } from '../validators';

export interface RuleForbidden extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'forbidden';

  /**
   * Removes the forbidden value.
   *
   * @type {'boolean'}
   * @memberof RuleForbidden
   */
  remove?: boolean;
}

export function IsForbidden(options?: RuleForbidden): PropertyDecorator {
  return createRuleDecorator<RuleForbidden>('forbidden', options);
}
