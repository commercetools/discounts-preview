import React, { useMemo, useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import type {
  LineItem as LineItemType,
  Money,
} from '@commercetools/platform-sdk';
import QuantityControls from './quantity-controls';
import DiscountBreakdown from './discounts-breakdown';
import messages from './messages';
import { useLocalizedString, useMoney } from '../../hooks/use-localization';
import { useCurrentCart } from '../../contexts/current-cart-context';

interface LineItemCardProps {
  item: LineItemType;
}

const LineItemCard: React.FC<LineItemCardProps> = ({ item }) => {
  const intl = useIntl();
  const { convertLocalizedString } = useLocalizedString();
  const { convertMoneytoString, divideMoney, multiplyMoney } = useMoney();
  const { updateLineItemQuantity } = useCurrentCart();
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const unitDiscountedPrice = divideMoney(item.totalPrice, item.quantity);
  const retailUnitPrice = item.price.value.centAmount;
  const hasDiscount = retailUnitPrice !== unitDiscountedPrice?.centAmount;

  // Check for any type of discount - either discountedPricePerQuantity OR product discount
  const anyTypeDiscount =
    (item.discountedPricePerQuantity &&
      item.discountedPricePerQuantity.length > 0) ||
    item.price.discounted;

  const unitDiscount: Money | null = useMemo(() => {
    if (anyTypeDiscount) {
      let unitDiscountAmount = 0;

      // Product discount per unit
      if (item.price.discounted) {
        unitDiscountAmount +=
          item.price.value.centAmount - item.price.discounted.value.centAmount;
      }

      // Cart discounts per unit - FIXED: Handle multiple discount groups
      if (
        item.discountedPricePerQuantity &&
        item.discountedPricePerQuantity.length > 0
      ) {
        const cartDiscountPerUnit = item.discountedPricePerQuantity.reduce(
          (total, priceQuantity) => {
            const discountSum =
              priceQuantity.discountedPrice.includedDiscounts?.reduce(
                (sum, discount) => {
                  return sum + discount.discountedAmount.centAmount;
                },
                0
              ) || 0;
            return total + discountSum;
          },
          0
        );
        unitDiscountAmount += cartDiscountPerUnit;
      }

      return {
        centAmount: unitDiscountAmount,
        currencyCode: item.price.value.currencyCode,
      };
    }
    return null;
  }, [anyTypeDiscount, item.price.discounted, item.discountedPricePerQuantity]);

  const totalDiscount = useMemo(() => {
    if (unitDiscount) {
      return multiplyMoney(unitDiscount, item.quantity);
    }
    return null;
  }, [unitDiscount, item.quantity]);

  const itemName = convertLocalizedString(item.name);
  const imageUrl =
    item.variant.images && item.variant.images.length > 0
      ? item.variant.images[0].url
      : null;

  const onUpdateQuantity = (lineItemId: string, newQuantity: number) => {
    setIsUpdating(true);
    updateLineItemQuantity(lineItemId, newQuantity)
      .finally(() => {
        setIsUpdating(false);
      })
      .catch(() => {
        setIsUpdating(false);
      });
  };

  return (
    <Flex
      alignItems="flex-start"
      paddingBottom="400"
      marginBottom="400"
      borderBottom="solid-25"
      borderColor="neutral.4"
      _last={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}
    >
      <Flex
        width="2000"
        height="2000"
        marginRight="400"
        flexShrink="0"
        borderRadius="100"
        overflow="hidden"
        bg="neutral.4"
        alignItems="center"
        justifyContent="center"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={itemName}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        ) : (
          <Text textStyle="sm" color="neutral.11">
            {intl.formatMessage(messages.noImage)}
          </Text>
        )}
      </Flex>
      <Stack gap="300">
        <Stack gap="100">
          <Heading as="h3" size="md" color="neutral.12">
            {itemName}
          </Heading>
          <Text textStyle="sm" fontWeight="bold" color="info.11">
            {intl.formatMessage(messages.retailUnitPrice, {
              price: convertMoneytoString(item.price.value),
            })}
          </Text>
          <Text
            textStyle="sm"
            fontWeight="bold"
            color={hasDiscount ? 'positive.11' : 'neutral.11'}
          >
            {intl.formatMessage(
              hasDiscount ? messages.discountedPrice : messages.regularPrice,
              {
                price: convertMoneytoString(unitDiscountedPrice),
              }
            )}
          </Text>
        </Stack>
        <QuantityControls
          lineItemId={item.id}
          quantity={item.quantity}
          isUpdating={isUpdating}
          onUpdateQuantity={onUpdateQuantity}
        />
        {anyTypeDiscount && (
          <>
            <Stack gap="100">
              <Text textStyle="sm" color="primary.11">
                {intl.formatMessage(messages.discountedUnitPrice, {
                  price: convertMoneytoString(unitDiscountedPrice),
                })}
              </Text>
              <Text textStyle="sm" color="positive.11">
                {intl.formatMessage(messages.discountPerUnit, {
                  price: convertMoneytoString(multiplyMoney(unitDiscount, -1)),
                })}
              </Text>
            </Stack>

            {/* Total Pricing Information */}
            <Stack gap="100">
              <Text textStyle="sm" color="primary.11">
                {intl.formatMessage(messages.priceForItems, {
                  count: item.quantity,
                  price: convertMoneytoString(item.totalPrice),
                })}
              </Text>
              <Text textStyle="sm" color="positive.11">
                {intl.formatMessage(messages.totalDiscounts, {
                  price: convertMoneytoString(multiplyMoney(totalDiscount, -1)),
                })}
              </Text>
            </Stack>

            <Button
              variant="ghost"
              size="sm"
              alignSelf="flex-start"
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
            >
              {isBreakdownOpen
                ? intl.formatMessage(messages.hideBreakdown)
                : intl.formatMessage(messages.showBreakdown)}
            </Button>
            {isBreakdownOpen && <DiscountBreakdown item={item} />}
          </>
        )}
      </Stack>
    </Flex>
  );
};

LineItemCard.displayName = 'LineItemCard';

export default LineItemCard;
