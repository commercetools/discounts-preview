/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  Separator,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { Delete } from '@commercetools/nimbus-icons';
import { useIntl } from 'react-intl';
import type { Cart, Money } from '@commercetools/platform-sdk';
import messages from './messages';
import { useLocalizedString, useMoney } from '../../hooks/use-localization';
import { useCurrentCart } from '../../contexts/current-cart-context';

interface AppliedDiscountsSectionProps {
  cartData: Cart;
  discountData: {
    totalCartDiscounts: Money;
    totalProductDiscounts: Money;
    totalAllDiscounts: Money;
    cartDiscountMap: Map<string, { name: string; value: Money }>;
    productDiscountMap: Map<string, { name: string; value: Money }>;
  };
}

type TDiscountEntry = { name: string; value: Money };

const AppliedDiscountsSection: React.FC<AppliedDiscountsSectionProps> = ({
  cartData,
  discountData,
}) => {
  const intl = useIntl();
  const { removeDiscountCode } = useCurrentCart();
  const { convertLocalizedString } = useLocalizedString();
  const { convertMoneytoString } = useMoney();

  const onRemoveDiscount = async (discountCodeId: string) => {
    await removeDiscountCode(discountCodeId);
  };

  const renderDiscountGroup = (
    title: string,
    subtotalLabel: string,
    entries: TDiscountEntry[],
    subtotal: Money
  ) => (
    <Box marginBottom="300" paddingTop="300">
      <Heading as="h3" size="md" color="primary.11">
        {title}
      </Heading>
      <Box as="ul" paddingLeft="500" margin="0" listStyle="decimal">
        {entries.map((discount, index) => (
          <li key={index}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              paddingTop="100"
            >
              <Text fontWeight="bold">{discount.name}</Text>
              <Text textStyle="sm" fontWeight="bold">
                {convertMoneytoString(discount.value)}
              </Text>
            </Flex>
          </li>
        ))}
      </Box>
      <Flex justifyContent="space-between" alignItems="center" paddingTop="100">
        <Text color="info.11">{subtotalLabel}</Text>
        <Text textStyle="sm" fontWeight="bold" color="info.11">
          {convertMoneytoString(subtotal)}
        </Text>
      </Flex>
    </Box>
  );

  return (
    <>
      <Card.Root>
        <Card.Body>
          <Heading as="h3" size="md" color="primary.11">
            {intl.formatMessage(messages.customerAppliedDiscounts)}
          </Heading>
          <Stack gap="200" marginTop="200">
            {cartData.discountCodes && cartData.discountCodes.length > 0 ? (
              cartData.discountCodes.map((discount) => (
                <Flex
                  key={discount.discountCode.id}
                  gap="200"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex gap="200" alignItems="center">
                    <Text fontWeight="bold">
                      {intl.formatMessage(messages.discountCode, {
                        name:
                          convertLocalizedString(
                            discount.discountCode.obj?.name
                          ) || intl.formatMessage(messages.unnamedDiscount),
                      })}
                    </Text>
                    <Text textStyle="sm">
                      {discount.discountCode.obj?.code}
                    </Text>
                  </Flex>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveDiscount(discount.discountCode.id)}
                  >
                    <Icon as={Delete} />
                    {intl.formatMessage(messages.remove)}
                  </Button>
                </Flex>
              ))
            ) : (
              <Box padding="200" fontStyle="italic">
                <Text textStyle="sm">
                  {intl.formatMessage(messages.noDiscountsApplied)}
                </Text>
              </Box>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          {discountData.totalAllDiscounts.centAmount > 0 ? (
            <Box>
              {/* Product Discounts Section */}
              {discountData.productDiscountMap.size > 0 &&
                renderDiscountGroup(
                  intl.formatMessage(messages.productDiscountsTitle),
                  intl.formatMessage(messages.productDiscountsSubtotal),
                  Array.from(discountData.productDiscountMap.values()),
                  discountData.totalProductDiscounts
                )}
              <Separator marginY="400" />

              {/* Cart Discounts Section */}
              {discountData.cartDiscountMap.size > 0 &&
                renderDiscountGroup(
                  intl.formatMessage(messages.cartDiscountsTitle),
                  intl.formatMessage(messages.cartDiscountsSubtotal),
                  Array.from(discountData.cartDiscountMap.values()),
                  discountData.totalCartDiscounts
                )}
              <Separator marginY="400" />

              {/* Total Discounts */}
              <Flex
                justifyContent="space-between"
                alignItems="center"
                paddingTop="100"
              >
                <Text fontWeight="bold" color="info.11">
                  {intl.formatMessage(messages.totalAllDiscounts)}
                </Text>
                <Text textStyle="sm" fontWeight="bold" color="info.11">
                  {convertMoneytoString(discountData.totalAllDiscounts)}
                </Text>
              </Flex>
            </Box>
          ) : (
            <Box padding="200" fontStyle="italic" color="neutral.11">
              <Text>{intl.formatMessage(messages.noDiscountsApplied)}</Text>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </>
  );
};

AppliedDiscountsSection.displayName = 'AppliedDiscountsSection';

export default AppliedDiscountsSection;
