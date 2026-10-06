/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import {
  escapeUnsupportedChars,
  isPartialDefaultPredicate,
  parse,
  stringify,
} from './predicate';

describe('parse', () => {
  it.each([undefined, null, ''])('returns isEmpty for %p', (input) => {
    expect(parse(input)).toEqual({ isEmpty: true });
  });

  it('parses a simple condition', () => {
    expect(parse('totalPrice >= "20.00 USD"')).toMatchObject({
      kind: 'condition',
      operator: '>=',
      value: '20.00 USD',
    });
  });

  it('throws on an invalid predicate', () => {
    expect(() => parse('nonsense ((')).toThrow();
  });
});

describe('stringify', () => {
  it.each([
    'totalPrice >= "20.00 USD"',
    'totalPrice >= "20.00 USD" and lineItemExists(sku = "A") = true',
    'customerGroup.key = "vip"',
  ])('round-trips %s', (predicate) => {
    expect(stringify(parse(predicate) as Parameters<typeof stringify>[0])).toBe(
      predicate
    );
  });

  it('returns an empty string for an empty AST', () => {
    expect(stringify(null)).toBe('');
    expect(stringify({})).toBe('');
  });
});

describe('escapeUnsupportedChars', () => {
  it('replaces whitespace characters with spaces', () => {
    expect(escapeUnsupportedChars('a\tb\nc')).toBe('a b c');
  });
});

describe('isPartialDefaultPredicate', () => {
  it('is false for empty input', () => {
    expect(isPartialDefaultPredicate(undefined)).toBe(false);
    expect(isPartialDefaultPredicate('')).toBe(false);
  });

  it('is false for a complete predicate', () => {
    expect(isPartialDefaultPredicate('totalPrice >= "20.00 USD"')).toBe(false);
  });
});
