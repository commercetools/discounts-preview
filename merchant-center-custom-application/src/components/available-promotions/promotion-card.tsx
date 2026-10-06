/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React, { useMemo } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from '@commercetools/nimbus';
import {
  Add,
  Cancel,
  CheckCircle,
  Close,
  LocalFireDepartment,
} from '@commercetools/nimbus-icons';
import { useIntl } from 'react-intl';
import { useCurrentCart } from '../../contexts';
import { useLocalizedString, useMoney } from '../../hooks/use-localization';
import type { PromotionWithValue } from '../../hooks/use-promotions';
import messages from './messages';
import PromotionBreakdown from './promotion-breakdown';

interface PromotionCardProps {
  promo: PromotionWithValue;
  isBestDeal: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promo, isBestDeal }) => {
  const intl = useIntl();
  const { convertMoneytoString } = useMoney();
  const { convertLocalizedString } = useLocalizedString();
  const { currentCart, applyDiscountCode } = useCurrentCart();
  const promoName =
    convertLocalizedString(promo.name) ||
    intl.formatMessage(messages.unnamedPromotion);
  const promoDescription = convertLocalizedString(promo.description);

  const currencyCode =
    currentCart?.lineItems?.[0]?.price?.value?.currencyCode || 'USD';

  const isApplied = useMemo(() => {
    return currentCart?.discountCodes?.some(
      (discount) => discount.discountCode.obj?.code === promo.code
    );
  }, [currentCart, promo.code]);

  const onApplyDiscount = async (discountCode: string) => {
    await applyDiscountCode(discountCode);
  };

  const isAutomatic = promo.custom?.fields?.isAutomatic;
  const cartDiscount = promo.cartDiscounts?.[0]?.obj;
  const isStacking = cartDiscount?.stackingMode === 'Stacking';

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="300">
          <Flex justify="space-between" align="flex-start" mb="400">
            <Stack gap="300">
              <Flex gap="300" align="center">
                <Heading as="h2" size="md" color="primary.11">
                  {promoName}
                </Heading>
                {isBestDeal && promo.isApplicable && (
                  <Badge size="2xs" colorPalette="positive">
                    <Icon as={LocalFireDepartment} />
                    {intl.formatMessage(messages.bestDeal)}
                  </Badge>
                )}
              </Flex>
              {!!promoDescription && (
                <Text fontWeight="600">{promoDescription}</Text>
              )}
              <Text fontSize="300">
                {intl.formatMessage(messages.promotionCode, {
                  code: promo.code,
                })}
              </Text>
            </Stack>

            <Flex gap="200">
              {isAutomatic !== undefined && (
                <Badge
                  size="2xs"
                  colorPalette={isAutomatic ? 'info' : 'critical'}
                >
                  <Icon as={isAutomatic ? CheckCircle : Cancel} />
                  {intl.formatMessage(messages.auto)}
                </Badge>
              )}
              {cartDiscount && (
                <Badge
                  size="2xs"
                  colorPalette={isStacking ? 'info' : 'critical'}
                >
                  <Icon as={isStacking ? Add : Close} />
                  {intl.formatMessage(messages.stackable)}
                </Badge>
              )}
            </Flex>
          </Flex>

          <Flex gap="300" justify="space-between">
            {promo.isApplicable && (
              <Stack gap="300">
                <Flex gap="300">
                  <Text fontWeight="600" color="primary.11">
                    {intl.formatMessage(messages.cartTotal)}
                  </Text>
                  <Text fontSize="300">
                    {convertMoneytoString(promo.totalCart)}
                  </Text>
                </Flex>

                <Flex gap="300">
                  <Text fontWeight="600" color="primary.11">
                    {intl.formatMessage(messages.discountTotal)}
                  </Text>
                  <Text fontSize="300">
                    {convertMoneytoString(
                      promo.discountValue || {
                        centAmount: 0,
                        currencyCode: currencyCode,
                      }
                    )}
                  </Text>
                </Flex>
              </Stack>
            )}
            {!promo.isApplicable && (
              <Text fontSize="300" color="critical.11">
                {intl.formatMessage(messages.notApplicablePromotion)}
              </Text>
            )}

            {promo.isApplicable && (
              <Box>
                <Button
                  variant="solid"
                  colorPalette="primary"
                  isDisabled={isApplied}
                  onPress={() => onApplyDiscount(promo.code)}
                >
                  {isApplied
                    ? intl.formatMessage(messages.applied)
                    : intl.formatMessage(messages.applyDiscount)}
                </Button>
              </Box>
            )}
          </Flex>

          {promo.isApplicable && (
            <PromotionBreakdown promo={promo} currencyCode={currencyCode} />
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

PromotionCard.displayName = 'PromotionCard';

export default PromotionCard;
