/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import { ReactNode } from 'react';
import {
  AutoDiscountsProvider,
  useAutoDiscounts,
} from './auto-discounts-context';
import { CurrentCartProvider, useCurrentCart } from './current-cart-context';
import {
  CurrentUserProvider,
  useCurrentCustomer,
} from './current-user-context';
import { PromotionProvider, usePromotionContext } from './promotion-context';

export {
  useCurrentCustomer,
  useAutoDiscounts,
  useCurrentCart,
  usePromotionContext,
};

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CurrentUserProvider>
      <CurrentCartProvider>
        <AutoDiscountsProvider>
          <PromotionProvider>{children}</PromotionProvider>
        </AutoDiscountsProvider>
      </CurrentCartProvider>
    </CurrentUserProvider>
  );
};
