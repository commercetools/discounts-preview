/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React from 'react';
import {
  Accordion,
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Icon,
  Text,
} from '@commercetools/nimbus';
import PanelHeader from '../panel-header';
import { CheckCircle, Info, Schedule } from '@commercetools/nimbus-icons';
import { useIntl } from 'react-intl';
import type { DiscountAnalysis } from '../../hooks/use-cart-analysis';
import { useLocalizedString } from '../../hooks/use-localization';
import messages from './messages';

interface DiscountAnalysisSectionProps {
  discountAnalysis: DiscountAnalysis[];
}

const DiscountAnalysisSection: React.FC<DiscountAnalysisSectionProps> = ({
  discountAnalysis,
}) => {
  const intl = useIntl();
  const { convertLocalizedString } = useLocalizedString();

  const qualified = discountAnalysis.filter(
    (a) => a.qualificationStatus === 'QUALIFIED'
  );
  const pending = discountAnalysis.filter(
    (a) => a.qualificationStatus === 'PENDING'
  );
  const other = discountAnalysis.filter(
    (a) =>
      a.qualificationStatus === 'NOT_APPLICABLE' ||
      a.qualificationStatus === 'UNKNOWN'
  );

  return (
    <Card.Root>
      <Card.Body>
        <Heading as="h3" size="md" color="primary.11">
          {intl.formatMessage(messages.discountAnalysis)}
        </Heading>
        <Box marginTop="400">
          <Accordion.Root allowsMultipleExpanded>
            {/* Qualified Discounts */}
            <Accordion.Item value="qualified">
              <PanelHeader
                title={intl.formatMessage(messages.qualifiedDiscounts, {
                  count: qualified.length,
                })}
              />
              <Accordion.Content>
                {qualified.map((analysis, idx) => (
                  <Flex
                    key={idx}
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="300"
                  >
                    <Box>
                      <Text fontWeight="bold">
                        {convertLocalizedString(analysis.discount.name)}
                      </Text>
                      {analysis.discount.description && (
                        <Text textStyle="sm">
                          {convertLocalizedString(
                            analysis.discount.description
                          )}
                        </Text>
                      )}
                    </Box>
                    <Badge size="2xs" colorPalette="positive">
                      <Icon as={CheckCircle} />
                      {intl.formatMessage(messages.applied)}
                    </Badge>
                  </Flex>
                ))}
              </Accordion.Content>
            </Accordion.Item>

            {/* Pending Discounts */}
            <Accordion.Item value="pending">
              <PanelHeader
                title={intl.formatMessage(messages.potentialDiscountsSection, {
                  count: pending.length,
                })}
              />
              <Accordion.Content>
                {pending.map((analysis, idx) => (
                  <Flex
                    key={idx}
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="300"
                  >
                    <Box>
                      <Text fontWeight="bold">
                        {convertLocalizedString(analysis.discount.name)}
                      </Text>
                      <Text textStyle="sm">
                        {analysis.qualificationMessage}
                      </Text>
                    </Box>
                    <Badge size="2xs" colorPalette="warning">
                      <Icon as={Schedule} />
                      {intl.formatMessage(messages.pending)}
                    </Badge>
                  </Flex>
                ))}
              </Accordion.Content>
            </Accordion.Item>

            {/* Not Applicable Discounts */}
            <Accordion.Item value="other">
              <PanelHeader
                title={intl.formatMessage(messages.otherDiscounts, {
                  count: other.length,
                })}
              />
              <Accordion.Content>
                {other.map((analysis, idx) => (
                  <Flex
                    key={idx}
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="300"
                  >
                    <Box>
                      <Text fontWeight="bold">
                        {convertLocalizedString(analysis.discount.name)}
                      </Text>
                      <Text textStyle="sm">
                        {analysis.qualificationMessage ||
                          'Not applicable to current cart'}
                      </Text>
                    </Box>
                    <Badge size="2xs" colorPalette="neutral">
                      <Icon as={Info} />
                      {analysis.qualificationStatus === 'UNKNOWN'
                        ? intl.formatMessage(messages.special)
                        : intl.formatMessage(messages.notApplicable)}
                    </Badge>
                  </Flex>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};

DiscountAnalysisSection.displayName = 'DiscountAnalysisSection';

export default DiscountAnalysisSection;
