import {
  Accordion,
  Badge,
  Box,
  Card,
  LoadingSpinner,
  Stack,
  Text,
} from '@commercetools/nimbus';
import PanelHeader from '../panel-header';
import React from 'react';
import { useIntl } from 'react-intl';
import type {
  ProductDiscountReference,
  Money,
  CartDiscountReference,
} from '@commercetools/platform-sdk';
import { useCurrentCart } from '../../contexts';
import { useCartAnalysis } from '../../hooks/use-cart-analysis';
import AppliedDiscountsSection from './applied-discounts-section';
import CartTotalsSection from './cart-total-section';
import DiscountAnalysisSection from './discount-analysis-section';
import LineItemCard from './lineitem-card';
import messages from './messages';
import PotentialDiscountsSection from './potential-discounts-section';
import { useLocalizedString, useMoney } from '../../hooks/use-localization';

const CartContent: React.FC = () => {
  const { currentCart: cartData, isLoading } = useCurrentCart();
  const { addMoney } = useMoney();
  const { convertLocalizedString } = useLocalizedString();
  const intl = useIntl();
  const { cartAnalysis, isAnalyzing } = useCartAnalysis(cartData);

  // Calculate discount data
  const calculateDiscountData = (): {
    totalCartDiscounts: Money;
    totalProductDiscounts: Money;
    totalAllDiscounts: Money;
    cartDiscountMap: Map<string, { name: string; value: Money }>;
    productDiscountMap: Map<string, { name: string; value: Money }>;
  } => {
    const cartDiscountMap = new Map();
    const productDiscountMap = new Map();
    const currencyCode = cartData?.totalPrice.currencyCode || 'USD';
    const zeroMoney: Money = {
      centAmount: 0,
      currencyCode,
    };

    if (!cartData) {
      return {
        totalCartDiscounts: zeroMoney,
        totalProductDiscounts: zeroMoney,
        totalAllDiscounts: zeroMoney,
        cartDiscountMap: new Map(),
        productDiscountMap: new Map(),
      };
    }

    let totalCartDiscountsCents = 0;
    let totalProductDiscountsCents = 0;

    // Cart-level discounts
    if (cartData.discountOnTotalPrice?.discountedAmount?.centAmount) {
      totalCartDiscountsCents +=
        cartData.discountOnTotalPrice.discountedAmount.centAmount;
      cartData.discountOnTotalPrice.includedDiscounts.forEach((discount) => {
        const name =
          convertLocalizedString(
            (discount.discount as CartDiscountReference)?.obj?.name
          ) || 'Unnamed Cart Discount';
        cartDiscountMap.set(discount.discount.id, {
          name: name,
          value: discount.discountedAmount,
        });
      });
    }

    // Line item discounts
    cartData.lineItems.forEach((item) => {
      // Product discounts
      if (item.price.discounted) {
        const productDiscountPerUnit =
          item.price.value.centAmount - item.price.discounted.value.centAmount;
        totalProductDiscountsCents += productDiscountPerUnit * item.quantity;
        const discountId = item.price.discounted.discount.id;
        const discountName =
          convertLocalizedString(
            (item.price.discounted.discount as ProductDiscountReference)?.obj
              ?.name
          ) || 'Product Discount';

        if (productDiscountMap.has(discountId)) {
          productDiscountMap.set(discountId, {
            name: discountName,
            value: addMoney(productDiscountMap.get(discountId).value, {
              centAmount: totalProductDiscountsCents,
              currencyCode,
            }),
          });
        } else {
          productDiscountMap.set(discountId, {
            name: discountName,
            value: {
              centAmount: totalProductDiscountsCents,
              currencyCode,
            },
          });
        }
      }

      // Cart discounts on line items
      if (
        item.discountedPricePerQuantity &&
        item.discountedPricePerQuantity.length > 0
      ) {
        item.discountedPricePerQuantity.forEach((priceQuantity) => {
          if (priceQuantity.discountedPrice.includedDiscounts) {
            priceQuantity.discountedPrice.includedDiscounts.forEach(
              (discount) => {
                totalCartDiscountsCents +=
                  discount.discountedAmount.centAmount * priceQuantity.quantity;

                const discountId = discount.discount.id;
                const discountName =
                  convertLocalizedString(
                    (discount.discount as CartDiscountReference)?.obj?.name
                  ) || 'Cart Discount';

                if (cartDiscountMap.has(discountId)) {
                  cartDiscountMap.set(discountId, {
                    name: discountName,
                    value: addMoney(cartDiscountMap.get(discountId).value, {
                      centAmount: discount.discountedAmount.centAmount,
                      currencyCode,
                    }),
                  });
                } else {
                  cartDiscountMap.set(discountId, {
                    name: discountName,
                    value: {
                      centAmount: discount.discountedAmount.centAmount,
                      currencyCode,
                    },
                  });
                }
              }
            );
          }
        });
      }
    });

    return {
      totalCartDiscounts: {
        centAmount: totalCartDiscountsCents,
        currencyCode,
      },
      totalProductDiscounts: {
        centAmount: totalProductDiscountsCents,
        currencyCode,
      },
      totalAllDiscounts: {
        centAmount: totalCartDiscountsCents + totalProductDiscountsCents,
        currencyCode,
      },
      cartDiscountMap,
      productDiscountMap,
    };
  };

  const discountData = calculateDiscountData();
  const subtotalWithoutDiscounts = addMoney(
    cartData?.totalPrice,
    discountData.totalAllDiscounts
  );

  const renderPanel = (content: React.ReactNode) => (
    <Accordion.Root defaultExpandedKeys={['cart']}>
      <Accordion.Item value="cart">
        <PanelHeader
          title={intl.formatMessage(messages.headerTitle)}
          badge={
            cartData?.origin === 'RecurringOrder' ? (
              <Badge size="2xs" colorPalette="info">
                {intl.formatMessage(messages.recurringOrder)}
              </Badge>
            ) : undefined
          }
        />
        <Accordion.Content>{content}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );

  if (isLoading || isAnalyzing) {
    return renderPanel(
      <Box padding="600" textAlign="center">
        <LoadingSpinner size="lg" />
        <Text>{intl.formatMessage(messages.loadingCart)}</Text>
      </Box>
    );
  }

  if (!cartData) {
    return renderPanel(
      <Box padding="600" textAlign="center" color="neutral.11">
        <Text>{intl.formatMessage(messages.emptyCart)}</Text>
      </Box>
    );
  }

  return renderPanel(
    <Stack gap="300" paddingBottom="500" width="100%">
      {/* Line Items */}
      <Card.Root>
        <Card.Body>
          {cartData.lineItems.map((item) => (
            <LineItemCard key={item.id} item={item} />
          ))}
        </Card.Body>
      </Card.Root>

      {/* Potential Discounts */}
      {cartAnalysis && cartAnalysis.discountAnalysis && (
        <PotentialDiscountsSection
          discountAnalysis={cartAnalysis.discountAnalysis}
        />
      )}

      {/* Discount Analysis */}
      {cartAnalysis && cartAnalysis.discountAnalysis && (
        <DiscountAnalysisSection
          discountAnalysis={cartAnalysis.discountAnalysis}
        />
      )}

      {/* Customer Applied Discounts */}
      <AppliedDiscountsSection
        cartData={cartData}
        discountData={discountData}
      />

      {/* Cart Totals */}
      <CartTotalsSection
        subtotalWithoutDiscounts={subtotalWithoutDiscounts}
        totalAllDiscounts={discountData.totalAllDiscounts}
        cartTotal={cartData.totalPrice}
      />
    </Stack>
  );
};

CartContent.displayName = 'CartContent';

export default CartContent;
