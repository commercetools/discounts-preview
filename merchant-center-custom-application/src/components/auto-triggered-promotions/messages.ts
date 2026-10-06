/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  headerTitle: {
    id: 'AutoTriggeredPromotions.headerTitle',
    defaultMessage: 'All Cart Discounts Available',
  },
  paginationLabel: {
    id: 'AutoTriggeredPromotions.paginationLabel',
    defaultMessage: 'Cart discounts',
  },
  subHeader: {
    id: 'AutoTriggeredPromotions.subHeader',
    defaultMessage:
      "Discounts that are applied automatically depending on the 'active' and 'stackable' state.",
  },
  loadingDiscounts: {
    id: 'AutoTriggeredPromotions.loadingDiscounts',
    defaultMessage: 'Loading discounts...',
  },
  noDiscountsAvailable: {
    id: 'AutoTriggeredPromotions.noDiscountsAvailable',
    defaultMessage: 'No auto-triggered discounts available.',
  },
  unnamedPromotion: {
    id: 'AutoTriggeredPromotions.unnamedPromotion',
    defaultMessage: 'Unnamed Promotion',
  },
  active: {
    id: 'AutoTriggeredPromotions.active',
    defaultMessage: 'Active',
  },
  inactive: {
    id: 'AutoTriggeredPromotions.inactive',
    defaultMessage: 'Inactive',
  },
  stackable: {
    id: 'AutoTriggeredPromotions.stackable',
    defaultMessage: 'Stackable',
  },
  notStackable: {
    id: 'AutoTriggeredPromotions.notStackable',
    defaultMessage: 'Not Stackable',
  },
  error: {
    id: 'AutoTriggeredPromotions.error',
    defaultMessage: 'Error: {message}',
  },
});
