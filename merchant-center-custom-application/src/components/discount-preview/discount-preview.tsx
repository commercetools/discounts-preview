/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import { Alert, Box, Heading, Stack } from '@commercetools/nimbus';
import React from 'react';
import { useIntl } from 'react-intl';
import { useCurrentCart } from '../../contexts';
import AutoTriggeredPromotions from '../auto-triggered-promotions';
import AvailablePromotions from '../available-promotions';
import CartContent from '../cart-content';
import CartIdForm from '../cart-id-form';
import messages from './messages';

const DiscountPreview: React.FC = () => {
  const intl = useIntl();

  const { error } = useCurrentCart();

  return (
    <Box bg="neutral.2" minHeight="100vh" padding="500">
      <Stack gap="400">
        <Heading as="h1">{intl.formatMessage(messages.pageTitle)}</Heading>

        <CartIdForm />

        {error && (
          <Alert.Root colorPalette="critical">
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}

        <Box
          display="grid"
          gap="800"
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        >
          <Box>
            <CartContent />
          </Box>
          <Stack gap="800">
            <AvailablePromotions />
            <AutoTriggeredPromotions />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

DiscountPreview.displayName = 'DiscountPreview';

export default DiscountPreview;
