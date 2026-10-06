/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import type { CartDiscount } from '@commercetools/platform-sdk';
import { useCartDiscounts } from '../hooks/use-cart-discounts';

interface AutoDiscountsContextValue {
  autoDiscounts: CartDiscount[];
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  refreshAutoDiscounts: () => Promise<void>;
}

const AutoDiscountsContext = createContext<
  AutoDiscountsContextValue | undefined
>(undefined);

interface AutoDiscountsProviderProps {
  children: ReactNode;
}

export const AutoDiscountsProvider: React.FC<AutoDiscountsProviderProps> = ({
  children,
}) => {
  const { getAutoApplicableDiscounts } = useCartDiscounts();
  const [autoDiscounts, setAutoDiscounts] = useState<CartDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const totalPages = useMemo(() => {
    return Math.ceil(total / limit);
  }, [total, limit]);

  const refreshAutoDiscounts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const discounts = await getAutoApplicableDiscounts(
        limit,
        (page - 1) * limit
      );
      setTotal(discounts.total ?? 0);
      setAutoDiscounts(discounts.results as CartDiscount[]);
    } catch (err) {
      console.error('Error loading auto discounts:', err);
      setError('Failed to load auto-triggered discounts');
      setAutoDiscounts([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAutoApplicableDiscounts, limit, page]);

  const onPageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    setLimit(pageSize);
    setPage(1);
  };

  // Load auto discounts on mount
  useEffect(() => {
    refreshAutoDiscounts();
  }, [refreshAutoDiscounts]);

  const value: AutoDiscountsContextValue = {
    autoDiscounts,
    isLoading,
    error,
    page,
    limit,
    total,
    totalPages,
    refreshAutoDiscounts,
    onPageChange,
    onPageSizeChange,
  };

  return (
    <AutoDiscountsContext.Provider value={value}>
      {children}
    </AutoDiscountsContext.Provider>
  );
};

export const useAutoDiscounts = (): AutoDiscountsContextValue => {
  const context = useContext(AutoDiscountsContext);
  if (context === undefined) {
    throw new Error(
      'useAutoDiscounts must be used within an AutoDiscountsProvider'
    );
  }
  return context;
};
