/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import { DiscountPredicateTargetTypes } from './constants';
import { TNestedRule } from './types';
import { parse as predicateParser } from './generated-parser/parser';
/* AST -> String */

type TAstNode = {
  kind?: string;
  target?: string | TAstNode;
  operator?: string;
  value?: unknown;
  valueType?: string;
  name?: string;
  args?: (string | TAstNode)[];
  conditions?: TAstNode[];
  logical?: string;
  isNegated?: boolean;
};

type TAstValue = string | TAstNode;

const coerceTarget = (value: TAstValue | undefined): string => {
  switch (typeof value) {
    case 'object':
      /* eslint-disable  @typescript-eslint/no-use-before-define */
      return processNode(value, true);
    default: {
      const parts = (value ?? '').split('.');
      if (parts.length === 1) return value ?? '';
      return parts
        .map((part) => (/-/.test(part) ? `\`${part}\`` : part))
        .join('.');
    }
  }
};

const coerceValue = (value: unknown, valueType?: string): string => {
  if (valueType === 'string') {
    return `"${String(value).replaceAll('"', '\\"').trim()}"`;
  }

  return String(value);
};

const conditionToString = (node: TAstNode): string => {
  if (node.value === undefined)
    return `${coerceTarget(node.target)} ${node.operator}`;

  if (Array.isArray(node.value))
    return `${coerceTarget(node.target)} ${node.operator} (${node.value
      .map((value: unknown) => coerceValue(value, node.valueType))
      .join(',')})`;

  return `${coerceTarget(node.target)} ${node.operator} ${coerceValue(
    node.value,
    node.valueType
  )}`;
};

const predicateFieldToString = (node: TAstNode): string => {
  const name = node.name ?? '';
  const parts = name.split('.');
  if (parts.length === 1) return name;
  return parts.map((part) => (/-/.test(part) ? `\`${part}\`` : part)).join('.');
};

const predicateConstantToString = (node: TAstNode): string => {
  const constant = node.value as { type: string; value: unknown };
  if (constant.type === 'string') return `"${constant.value}"`;

  return `${constant.value}`;
};

const functionApplicationToString = (node: TAstNode): string => {
  const args = (node.args ?? []).map((arg) => coerceTarget(arg));

  return `${node.name}(${args.join(', ')})`;
};

const processNode = (node: TAstNode, isRoot = false): string => {
  if (node.kind === 'condition') {
    return conditionToString(node);
  }
  if (node.kind === DiscountPredicateTargetTypes.field) {
    return predicateFieldToString(node);
  }
  if (node.kind === DiscountPredicateTargetTypes.constant) {
    return predicateConstantToString(node);
  }
  if (node.kind === DiscountPredicateTargetTypes.function) {
    return functionApplicationToString(node);
  }
  if (node.kind === 'logical') {
    const conditions = (node.conditions ?? [])
      .map((condition) => processNode(condition))
      .join(` ${node.logical} `);

    if (node.isNegated) return `not(${conditions})`;
    return isRoot === true ? conditions : `(${conditions})`;
  }
  if (!node.kind) return '';

  throw new Error(`Unexpected kind ${node.kind}`);
};

/* EXPORTS */

/**
 * Given a string value, returns the same value but replaces any unsupported characters
 */

export const escapeUnsupportedChars = (input: string) =>
  input.replace(/\s/g, ' ');

const defaultOptions = {
  reportError: false,
};

/**
 * Given a string value, returns the parsed result based on the defined grammar.
 * If the input is invalid, it throws an exception.
 * If reporting is set to  'true', it removes sensitive fields
 * from the predicate and posts the result to sentry.
 */
export function parse(
  input: string | undefined | null,
  _options = defaultOptions
): TNestedRule | { isEmpty: true } {
  if (!input) return { isEmpty: true };

  const safeInput = escapeUnsupportedChars(input);
  try {
    return predicateParser(safeInput, {
      startRule: 'predicate',
      grammarSource: 'predicate-parser',
    });
  } catch (error) {
    // only use for development
    // if (typeof error.format === 'function') {
    //   console.log(
    //     error.format([{ source: 'predicate-parser', text: safeInput }])
    //   );
    // }
    throw error;
  }
}

/**
 * Given a string value potentially representing a predicate,
 * returns true when value is an invalid partial predicate that only has
 * a field identifier and an operator.
 */
export function isPartialDefaultPredicate(input: string | undefined): boolean {
  if (!input) return false;
  try {
    predicateParser(input, {
      startRule: 'target_and_operator',
      grammarSource: 'predicate-parser',
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Given a AST tree, returns the parsed result in a string.
 */
export function stringify(ast: TAstNode | null | undefined): string {
  if (!ast || !ast.kind) return '';
  return processNode(ast, true);
}
