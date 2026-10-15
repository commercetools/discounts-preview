import React from 'react';
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { Schedule } from '@commercetools/nimbus-icons';
import { useIntl } from 'react-intl';
import type { DiscountAnalysis } from '../../hooks/use-cart-analysis';
import messages from './messages';
import { useLocalizedString } from '../../hooks/use-localization';

interface PotentialDiscountsSectionProps {
  discountAnalysis: DiscountAnalysis[];
}

const PotentialDiscountsSection: React.FC<PotentialDiscountsSectionProps> = ({
  discountAnalysis,
}) => {
  const intl = useIntl();
  const { convertLocalizedString } = useLocalizedString();

  const pendingDiscounts = discountAnalysis.filter(
    (analysis) => analysis.qualificationStatus === 'PENDING'
  );

  return (
    <Card.Root>
      <Card.Body>
        <Heading as="h3" size="md" color="primary.11">
          {intl.formatMessage(messages.potentialDiscounts)}
        </Heading>
        <Stack gap="200" marginTop="400">
          {pendingDiscounts.length > 0 ? (
            pendingDiscounts.map((analysis, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
                padding="300"
                bg="neutral.2"
                borderRadius="100"
              >
                <Box>
                  <Text fontWeight="bold">
                    {convertLocalizedString(analysis.discount.name)}
                  </Text>
                  <Text textStyle="sm">{analysis.qualificationMessage}</Text>
                </Box>
                <Badge size="2xs" colorPalette="warning">
                  <Icon as={Schedule} />
                  {intl.formatMessage(messages.pending)}
                </Badge>
              </Flex>
            ))
          ) : (
            <Box padding="200" fontStyle="italic">
              <Text textStyle="sm">
                {intl.formatMessage(messages.noPotentialDiscounts)}
              </Text>
            </Box>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

PotentialDiscountsSection.displayName = 'PotentialDiscountsSection';

export default PotentialDiscountsSection;
