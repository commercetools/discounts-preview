import React from 'react';
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Icon,
  Stack,
} from '@commercetools/nimbus';
import { Add, Cancel, CheckCircle, Close } from '@commercetools/nimbus-icons';
import { useIntl } from 'react-intl';
import type { CartDiscount } from '@commercetools/platform-sdk';
import messages from './messages';
import { useLocalizedString } from '../../hooks/use-localization';

interface DiscountCardProps {
  discount: CartDiscount;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
  const { convertLocalizedString } = useLocalizedString();
  const intl = useIntl();
  const discountName = convertLocalizedString(discount.name);
  const isStacking = discount.stackingMode === 'Stacking';

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="300">
          <Heading as="h2" size="md" color="primary.11">
            {discountName}
          </Heading>
          <Box
            as="p"
            fontSize="300"
            fontFamily="mono"
            color="neutral.11"
            bg="neutral.2"
            p="200"
            borderRadius="100"
            overflowX="auto"
          >
            {discount.cartPredicate}
          </Box>
          <Flex gap="200">
            <Badge
              size="2xs"
              colorPalette={discount.isActive ? 'positive' : 'critical'}
            >
              <Icon as={discount.isActive ? CheckCircle : Cancel} />
              {discount.isActive
                ? intl.formatMessage(messages.active)
                : intl.formatMessage(messages.inactive)}
            </Badge>
            <Badge size="2xs" colorPalette={isStacking ? 'primary' : 'warning'}>
              <Icon as={isStacking ? Add : Close} />
              {isStacking
                ? intl.formatMessage(messages.stackable)
                : intl.formatMessage(messages.notStackable)}
            </Badge>
          </Flex>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

DiscountCard.displayName = 'DiscountCard';

export default DiscountCard;
