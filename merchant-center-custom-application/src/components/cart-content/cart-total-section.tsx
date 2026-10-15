import React from 'react';
import { Card, Flex, Text } from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useMoney } from '../../hooks/use-localization';
import { Money } from '@commercetools/platform-sdk';

interface CartTotalsSectionProps {
  subtotalWithoutDiscounts?: Money | null;
  totalAllDiscounts: Money | null;
  cartTotal: Money | null;
}

const CartTotalsSection: React.FC<CartTotalsSectionProps> = ({
  subtotalWithoutDiscounts,
  totalAllDiscounts,
  cartTotal,
}) => {
  const intl = useIntl();
  const { convertMoneytoString } = useMoney();

  return (
    <Card.Root>
      <Card.Body>
        <Flex justifyContent="space-between" alignItems="center" paddingY="300">
          <Text fontWeight="semibold" color="neutral.11">
            {intl.formatMessage(messages.subtotalWithoutDiscounts)}
          </Text>
          <Text fontWeight="semibold" color="neutral.11">
            {convertMoneytoString(subtotalWithoutDiscounts)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" paddingY="300">
          <Text fontWeight="bold" color="primary.11">
            {intl.formatMessage(messages.totalDiscount)}
          </Text>
          <Text fontWeight="bold" color="primary.11">
            -{convertMoneytoString(totalAllDiscounts)}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          paddingTop="400"
          borderTop="solid-25"
          borderColor="neutral.6"
        >
          <Text textStyle="lg" fontWeight="bold" color="neutral.12">
            {intl.formatMessage(messages.cartTotal)}
          </Text>
          <Text textStyle="lg" fontWeight="bold" color="neutral.12">
            {convertMoneytoString(cartTotal)}
          </Text>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

CartTotalsSection.displayName = 'CartTotalsSection';

export default CartTotalsSection;
