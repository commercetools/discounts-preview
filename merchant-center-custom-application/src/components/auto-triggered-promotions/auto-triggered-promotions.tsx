/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React from 'react';
import {
  Accordion,
  Box,
  Flex,
  LoadingSpinner,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import DiscountCard from './discount-card';
import ListPagination from '../list-pagination';
import PanelHeader from '../panel-header';
import messages from './messages';
import { useAutoDiscounts } from '../../contexts';

const AutoTriggeredPromotions: React.FC = () => {
  const intl = useIntl();
  const {
    autoDiscounts,
    isLoading,
    error,
    page,
    limit,
    total,
    onPageChange,
    onPageSizeChange,
  } = useAutoDiscounts();

  const header = (
    <PanelHeader
      title={intl.formatMessage(messages.headerTitle)}
      subtitle={!error ? intl.formatMessage(messages.subHeader) : undefined}
    />
  );

  if (error) {
    return (
      <Accordion.Root defaultExpandedKeys={['auto-triggered']}>
        <Accordion.Item value="auto-triggered">
          {header}
          <Accordion.Content>
            <Box p="600" textAlign="center" color="critical.11">
              <Text>
                {intl.formatMessage(messages.error, { message: error })}
              </Text>
            </Box>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  }

  return (
    <Accordion.Root defaultExpandedKeys={['auto-triggered']}>
      <Accordion.Item value="auto-triggered">
        {header}
        <Accordion.Content>
          {isLoading ? (
            <Flex p="600" justify="center" align="center" gap="200">
              <LoadingSpinner size="lg" />
              <Text>{intl.formatMessage(messages.loadingDiscounts)}</Text>
            </Flex>
          ) : autoDiscounts.length === 0 ? (
            <Box p="600" textAlign="center" color="neutral.11">
              <Text>{intl.formatMessage(messages.noDiscountsAvailable)}</Text>
            </Box>
          ) : (
            <Stack gap="100">
              {autoDiscounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </Stack>
          )}
          <ListPagination
            label={intl.formatMessage(messages.paginationLabel)}
            total={total}
            page={page}
            pageSize={limit}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

AutoTriggeredPromotions.displayName = 'AutoTriggeredPromotions';

export default AutoTriggeredPromotions;
