/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

export const DiscountPredicateTargetTypes = {
  constant: 'predicateConstant',
  field: 'predicateField',
  function: 'functionApplication',
} as const;

export const customLineItemFunctions = [
  'customLineItemTotal',
  'customLineItemCount',
  'customLineItemGrossTotal',
  'customLineItemNetTotal',
];

export const lineItemFunctions = [
  'lineItemCount',
  'lineItemTotal',
  'lineItemNetTotal',
  'lineItemGrossTotal',
  'lineItemExists',
  'forAllLineItems',
];

export const RootLogical = {
  all: 'all',
  some: 'some',
} as const;
type TRootLogicalKeys = keyof typeof RootLogical;
export type TRootLogicalValues = (typeof RootLogical)[TRootLogicalKeys];
