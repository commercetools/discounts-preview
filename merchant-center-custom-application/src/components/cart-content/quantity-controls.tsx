/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import React from 'react';
import {
  Box,
  Flex,
  LoadingSpinner,
  NumberInput,
  Text,
} from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import messages from './messages';

interface QuantityControlsProps {
  lineItemId: string;
  quantity: number;
  isUpdating: boolean;
  onUpdateQuantity: (lineItemId: string, newQuantity: number) => void;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  lineItemId,
  quantity,
  isUpdating,
  onUpdateQuantity,
}) => {
  const intl = useIntl();

  const handleChange = (value: number) => {
    const newQuantity = Math.max(1, Math.trunc(value) || 1);
    if (newQuantity !== quantity) {
      onUpdateQuantity(lineItemId, newQuantity);
    }
  };

  return (
    <Flex alignItems="center" gap="300" marginTop="300">
      <Text textStyle="sm" fontWeight="medium" color="neutral.11">
        {intl.formatMessage(messages.quantity)}
      </Text>
      <Box position="relative">
        <NumberInput
          minValue={1}
          value={quantity}
          onChange={handleChange}
          isDisabled={isUpdating}
          width="2400"
        />
        {isUpdating && (
          <Flex
            position="absolute"
            inset="0"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.75)"
          >
            <LoadingSpinner size="sm" />
          </Flex>
        )}
      </Box>
      {isUpdating && (
        <Text textStyle="xs" fontWeight="medium" color="primary.11">
          {intl.formatMessage(messages.updating)}
        </Text>
      )}
    </Flex>
  );
};

QuantityControls.displayName = 'QuantityControls';

export default QuantityControls;
