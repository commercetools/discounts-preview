/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React from 'react';
import { Box, Card, Flex, Stack, Table, Text } from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import type { Money } from '@commercetools/platform-sdk';
import type { PromotionWithValue } from '../../hooks/use-promotions';
import messages from './messages';
import { useMoney } from '../../hooks/use-localization';

interface PromotionBreakdownProps {
  promo: PromotionWithValue;
  currencyCode: string;
}

const PromotionBreakdown: React.FC<PromotionBreakdownProps> = ({
  promo,
  currencyCode,
}) => {
  const intl = useIntl();
  const { convertMoneytoString, addMoney } = useMoney();
  const initialValue: Money = { centAmount: 0, currencyCode };
  const totlaDiscounts = promo.includedDiscounts.reduce(
    (acc: Money, curr): Money => addMoney(acc, curr.amount) as Money,
    initialValue
  );
  const totalItemLevelDiscounts = promo.includedItemLevelDiscounts.reduce(
    (acc: Money, curr): Money => addMoney(acc, curr.amount) as Money,
    initialValue
  );
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="300">
          {/* Cart Level Discounts */}
          {promo.includedDiscounts && promo.includedDiscounts.length > 0 && (
            <Stack gap="100">
              <Text fontWeight="600">
                {intl.formatMessage(messages.discountsOnCartTotal)}
              </Text>
              {promo.includedDiscounts.map((discount, idx) => (
                <Text key={idx} fontSize="300" color="neutral.11">
                  {discount.name}:{' '}
                  <Text as="span" fontWeight="600">
                    {convertMoneytoString(discount.amount)}
                  </Text>
                </Text>
              ))}
              <Flex
                justify="space-between"
                mt="200"
                p="200"
                fontWeight="600"
                bg="neutral.2"
                borderRadius="100"
                borderTop="1px solid"
                borderColor="neutral.6"
              >
                <Text as="span">
                  {intl.formatMessage(messages.cartDiscountsTotal)}
                </Text>
                <Text as="span" fontWeight="700" color="primary.11">
                  {convertMoneytoString(totlaDiscounts)}
                </Text>
              </Flex>
            </Stack>
          )}

          {/* Product Level Discounts */}
          <Stack gap="100">
            <Text fontWeight="600" color="neutral.11">
              {intl.formatMessage(messages.cartDiscountsOnProductLevel)}
            </Text>
            {promo.includedItemLevelDiscounts &&
            promo.includedItemLevelDiscounts.length > 0 ? (
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>
                      {intl.formatMessage(messages.sku)}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      {intl.formatMessage(messages.discountName)}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      {intl.formatMessage(messages.discountValue)}
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {promo.includedItemLevelDiscounts.map((discount, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{discount.skuName}</Table.Cell>
                      <Table.Cell>{discount.name}</Table.Cell>
                      <Table.Cell textAlign="end" fontWeight="600">
                        {convertMoneytoString(discount.amount)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell colSpan={2} fontWeight="600">
                      {intl.formatMessage(messages.productDiscountsTotal)}
                    </Table.Cell>
                    <Table.Cell
                      textAlign="end"
                      fontWeight="600"
                      color="primary.11"
                    >
                      {convertMoneytoString(totalItemLevelDiscounts)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              </Table.Root>
            ) : (
              <Box fontStyle="italic">
                <Text fontSize="300">
                  {intl.formatMessage(messages.noProductLevelDiscounts)}
                </Text>
              </Box>
            )}
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

PromotionBreakdown.displayName = 'PromotionBreakdown';

export default PromotionBreakdown;
