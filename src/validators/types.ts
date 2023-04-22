import {
  RuleAny,
  RuleArray,
  RuleBoolean,
  RuleClass,
  RuleCurrency,
  RuleDate,
  RuleEmail,
  RuleEnum,
  RuleEqual,
  RuleForbidden,
  RuleFunction,
  RuleLuhn,
  RuleMac,
  RuleMulti,
  RuleNumber,
  RuleObject,
  RuleObjectID,
  RuleRecord,
  RuleString,
  RuleTuple,
  RuleURL,
  RuleUUID,
} from './rules';

export type StrictMode = boolean | 'remove';

export interface MoleculerParamsOptions {
  async?: boolean;
  strict?: StrictMode;
}

export type ValidationRuleName =
  | 'any'
  | 'array'
  | 'boolean'
  | 'class'
  | 'currency'
  | 'custom'
  | 'date'
  | 'email'
  | 'enum'
  | 'equal'
  | 'forbidden'
  | 'function'
  | 'luhn'
  | 'mac'
  | 'multi'
  | 'number'
  | 'object'
  | 'record'
  | 'string'
  | 'url'
  | 'uuid'
  | string;

export interface RuleCustomInline<T = any> extends RuleCustom {
  /**
   * Name of built-in validator
   */
  type?: 'custom';
  /**
   * Custom checker function
   */
  check?: CheckerFunction<T>;
}

export interface RuleCustom {
  /**
   * Name of custom validator that will be used in validation rules
   */
  type?: string;
  /**
   * Every field in the schema will be required by default. If you'd like to define optional fields, set optional: true.
   * @default false
   */
  optional?: boolean;

  /**
   * If you want disallow `undefined` value but allow `null` value, use `nullable` instead of `optional`.
   * @default false
   */
  nullable?: boolean;

  /**
   * You can set your custom messages in the validator constructor
   * Sometimes the standard messages are too generic. You can customise messages per validation type per field
   */
  messages?: MessagesType;

  /**
   * Default value
   */
  default?: any;

  /**
   * Custom checker function
   */
  custom?: CheckerFunction;

  /**
   * You can define any additional options for custom validators
   */
  [key: string]: any;
}

/**
 * List of all possible keys that can be used for error message override
 */
export interface BuiltInMessages {
  /**
   * The '{field}' field is required.
   */
  required?: string;
  /**
   * The '{field}' field must be a string.
   */
  string?: string;
  /**
   * The '{field}' field must not be empty.
   */
  stringEmpty?: string;
  /**
   * The '{field}' field length must be greater than or equal to {expected} characters long.
   */
  stringMin?: string;
  /**
   * The '{field}' field length must be less than or equal to {expected} characters long.
   */
  stringMax?: string;
  /**
   * The '{field}' field length must be {expected} characters long.
   */
  stringLength?: string;
  /**
   * The '{field}' field fails to match the required pattern.
   */
  stringPattern?: string;
  /**
   * The '{field}' field must contain the '{expected}' text.
   */
  stringContains?: string;
  /**
   * The '{field}' field does not match any of the allowed values.
   */
  stringEnum?: string;
  /**
   * The '{field}' field must be a numeric string.
   */
  stringNumeric?: string;
  /**
   * The '{field}' field must be an alphabetic string.
   */
  stringAlpha?: string;
  /**
   * The '{field}' field must be an alphanumeric string.
   */
  stringAlphanum?: string;
  /**
   * The '{field}' field must be an alphadash string.
   */
  stringAlphadash?: string;

  /**
   * The '{field}' field must be a number.
   */
  number?: string;
  /**
   * The '{field}' field must be greater than or equal to {expected}.
   */
  numberMin?: string;
  /**
   * The '{field}' field must be less than or equal to {expected}.
   */
  numberMax?: string;
  /**
   * The '{field}' field must be equal with {expected}.
   */
  numberEqual?: string;
  /**
   * The '{field}' field can't be equal with {expected}.
   */
  numberNotEqual?: string;
  /**
   * The '{field}' field must be an integer.
   */
  numberInteger?: string;
  /**
   * The '{field}' field must be a positive number.
   */
  numberPositive?: string;
  /**
   * The '{field}' field must be a negative number.
   */
  numberNegative?: string;

  /**
   * The '{field}' field must be an array.
   */
  array?: string;
  /**
   * The '{field}' field must not be an empty array.
   */
  arrayEmpty?: string;
  /**
   * The '{field}' field must contain at least {expected} items.
   */
  arrayMin?: string;
  /**
   * The '{field}' field must contain less than or equal to {expected} items.
   */
  arrayMax?: string;
  /**
   * The '{field}' field must contain {expected} items.
   */
  arrayLength?: string;
  /**
   * The '{field}' field must contain the '{expected}' item.
   */
  arrayContains?: string;
  /**
   * The '{field} field value '{expected}' does not match any of the allowed values.
   */
  arrayEnum?: string;

  /**
   * The '{field}' field must be a boolean.
   */
  boolean?: string;

  /**
   * The '{field}' field must be a Date.
   */
  date?: string;
  /**
   * The '{field}' field must be greater than or equal to {expected}.
   */
  dateMin?: string;
  /**
   * The '{field}' field must be less than or equal to {expected}.
   */
  dateMax?: string;

  /**
   * The '{field}' field value '{expected}' does not match any of the allowed values.
   */
  enumValue?: string;

  /**
   * The '{field}' field value must be equal to '{expected}'.
   */
  equalValue?: string;
  /**
   * The '{field}' field value must be equal to '{expected}' field value.
   */
  equalField?: string;

  /**
   * The '{field}' field is forbidden.
   */
  forbidden?: string;

  /**
   * The '{field}' field must be a function.
   */
  function?: string;

  /**
   * The '{field}' field must be a valid e-mail.
   */
  email?: string;

  /**
   * The '{field}' field must be a valid checksum luhn.
   */
  luhn?: string;

  /**
   * The '{field}' field must be a valid MAC address.
   */
  mac?: string;

  /**
   * The '{field}' must be an Object.
   */
  object?: string;
  /**
   * The object '{field}' contains forbidden keys: '{actual}'.
   */
  objectStrict?: string;

  /**
   * The '{field}' field must be a valid URL.
   */
  url?: string;

  /**
   * The '{field}' field must be a valid UUID.
   */
  uuid?: string;
  /**
   * The '{field}' field must be a valid UUID version provided.
   */
  uuidVersion?: string;
}

/**
 * Type with description of custom error messages
 */
export type MessagesType = BuiltInMessages & { [key: string]: string };

/**
 * Union type of all possible built-in validators
 */
export type ValidationRuleObject =
  | RuleAny
  | RuleArray
  | RuleBoolean
  | RuleClass
  | RuleCurrency
  | RuleDate
  | RuleEmail
  | RuleEqual
  | RuleEnum
  | RuleForbidden
  | RuleFunction
  | RuleLuhn
  | RuleMac
  | RuleMulti
  | RuleNumber
  | RuleObject
  | RuleObjectID
  | RuleRecord
  | RuleString
  | RuleTuple
  | RuleURL
  | RuleUUID
  | RuleCustom
  | RuleCustomInline;

/**
 * Description of validation rule definition for a some property
 */
export type ValidationRule = ValidationRuleObject | ValidationRuleObject[] | ValidationRuleName;

/**
 * Definition for validation schema based on validation rules
 */
export type ValidationSchema<T = any> = {
  /**
   * Object properties which are not specified on the schema are ignored by default.
   * If you set the $$strict option to true any additional properties will result in an strictObject error.
   * @default false
   */
  $$strict?: StrictMode;

  /**
   * Enable asynchronous functionality. In this case the `validate` and `compile` methods return a `Promise`.
   * @default false
   */
  $$async?: boolean;

  /**
   * Basically the validator expects that you want to validate a Javascript object.
   * If you want others, you can define the root level schema.
   * @default false
   */
  $$root?: boolean;
} & {
  /**
   * List of validation rules for each defined field
   */
  [key in keyof T]: ValidationRule | undefined | any;
};

/**
 * Structure with description of validation error message
 */
export interface ValidationError {
  /**
   * Name of validation rule that generates this message
   */
  type: keyof BuiltInMessages | string;
  /**
   * Field that catch validation error
   */
  field: string;
  /**
   * Description of current validation error
   */
  message?: string;
  /**
   * Expected value from validation rule
   */
  expected?: any;
  /**
   * Actual value received by validation rule
   */
  actual?: any;
}

export interface Context<DATA = any> {
  index?: number;
  async?: boolean;
  rules?: ValidationRuleObject[];
  fn?: Function[];
  customs?: {
    [ruleName: string]: { schema: RuleCustom; messages: MessagesType };
  };
  meta?: object;
  data?: DATA;
}

export interface CheckerFunctionError {
  type: string;
  expected?: unknown;
  actual?: unknown;
  field?: string;
}

export type CheckerFunction<T = unknown> = (
  value: T,
  errors: CheckerFunctionError[],
  ruleSchema: ValidationRuleObject,
  path: string,
  parent: object | null,
  context: Context
) => T | Promise<T>;
