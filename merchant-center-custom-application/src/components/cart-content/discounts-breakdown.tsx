import React from 'react';
import { Box, Stack, Text } from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import type {
  CartDiscountReference,
  LineItem,
} from '@commercetools/platform-sdk';
import messages from './messages';
import { useLocalizedString, useMoney } from '../../hooks/use-localization';

interface DiscountBreakdownProps {
  item: LineItem;
}

const DiscountBreakdown: React.FC<DiscountBreakdownProps> = ({ item }) => {
  const intl = useIntl();
  const { convertMoneytoString, subtractMoney, multiplyMoney } = useMoney();
  const { convertLocalizedString } = useLocalizedString();

  return (
    <Stack
      gap="200"
      marginTop="300"
      paddingLeft="300"
      borderLeft="solid-25"
      borderColor="neutral.4"
    >
      {/* Product Discount Section */}
      {item.price.discounted && (
        <Stack padding="300" gap="100">
          <Text textStyle="sm" fontWeight="bold">
            {intl.formatMessage(messages.productDiscount)}
          </Text>
          <Text textStyle="sm">
            {convertLocalizedString(item.price.discounted.discount?.obj?.name)}
          </Text>
          <Box paddingLeft="200">
            <Text textStyle="sm">
              {intl.formatMessage(messages.perUnit, {
                price: convertMoneytoString(
                  subtractMoney(item.price.value, item.price.discounted.value)
                ),
              })}
            </Text>
            <Text textStyle="sm">
              {intl.formatMessage(messages.totalUnits, {
                count: item.quantity,
                price: convertMoneytoString(
                  multiplyMoney(
                    subtractMoney(
                      item.price.value,
                      item.price.discounted.value
                    ),
                    item.quantity
                  )
                ),
              })}
            </Text>
          </Box>
        </Stack>
      )}

      {/* Cart Discounts Section */}
      {item.discountedPricePerQuantity &&
      item.discountedPricePerQuantity.length > 0 ? (
        <Stack padding="300" gap="100">
          <Text textStyle="sm" fontWeight="bold">
            {intl.formatMessage(messages.cartDiscounts)}
          </Text>
          {item.discountedPricePerQuantity.map((priceQuantity, idx) =>
            priceQuantity.discountedPrice.includedDiscounts?.map(
              (discount, discIdx) => (
                <Box key={`${idx}-${discIdx}`}>
                  <Text textStyle="sm" fontWeight="medium">
                    {convertLocalizedString(
                      (discount.discount as CartDiscountReference)?.obj?.name
                    )}
                  </Text>
                  <Box paddingLeft="200">
                    <Text textStyle="sm">
                      {intl.formatMessage(messages.perUnit, {
                        price: convertMoneytoString(discount.discountedAmount),
                      })}
                    </Text>
                    <Text textStyle="sm">
                      {intl.formatMessage(messages.totalUnits, {
                        count: priceQuantity.quantity,
                        price: convertMoneytoString(
                          multiplyMoney(
                            discount.discountedAmount,
                            priceQuantity.quantity
                          )
                        ),
                      })}
                    </Text>
                  </Box>
                </Box>
              )
            )
          )}
        </Stack>
      ) : (
        <Stack padding="300" gap="100">
          <Text textStyle="sm" fontWeight="bold">
            {intl.formatMessage(messages.cartDiscounts)}
          </Text>
          <Text textStyle="sm" color="neutral.11">
            {intl.formatMessage(messages.noCartDiscounts)}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

DiscountBreakdown.displayName = 'DiscountBreakdown';

export default DiscountBreakdown;
