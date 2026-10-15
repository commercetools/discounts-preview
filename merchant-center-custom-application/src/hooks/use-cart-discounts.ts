import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import {
  actions,
  TSdkAction,
  useAsyncDispatch,
} from '@commercetools-frontend/sdk';
import type { PagedQueryResponse } from '@commercetools/platform-sdk';
import { useCallback } from 'react';
import { buildUrlWithParams } from '../utils/url';

type SortInput = {
  key: string;
  order: 'asc' | 'desc';
};

export const useCartDiscounts = () => {
  const context = useApplicationContext((context) => context);
  const dispatchCartAction = useAsyncDispatch<TSdkAction, PagedQueryResponse>();

  const getCartDiscounts = useCallback(
    async (
      where?: string,
      limit?: number,
      offset?: number,
      sort?: SortInput
    ): Promise<PagedQueryResponse> => {
      const result = await dispatchCartAction(
        actions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: buildUrlWithParams(`/${context?.project?.key}/cart-discounts`, {
            ...(where ? { where: where } : {}),
            ...(limit ? { limit: limit.toString() } : {}),
            ...(offset ? { offset: offset.toString() } : {}),
            ...(sort ? { sort: `${sort.key} ${sort.order}` } : {}),
          }),
        })
      );
      return result;
    },
    [context?.project?.key]
  );

  const getAutoApplicableDiscounts = useCallback(
    async (limit?: number, offset?: number): Promise<PagedQueryResponse> => {
      try {
        const result = await getCartDiscounts(
          'requiresDiscountCode=false',
          limit,
          offset
        );
        return result;
      } catch (err) {
        return {
          limit: 0,
          offset: 0,
          count: 0,
          results: [],
          total: 0,
        };
      }
    },
    [context?.project?.key]
  );

  return {
    getCartDiscounts,
    getAutoApplicableDiscounts,
  };
};
