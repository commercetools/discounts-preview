/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

import { Box, Checkbox, Flex, Link, Select } from '@commercetools/nimbus';
import React, { useMemo, type Key } from 'react';
import { useIntl } from 'react-intl';
import { useCurrentCart, useCurrentCustomer } from '../../contexts';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useMoney } from '../../hooks/use-localization';
import messages from './messages';

const CartIdForm: React.FC = () => {
  const intl = useIntl();
  const { convertMoneytoString } = useMoney();
  const context = useApplicationContext((context) => context);
  const { currentCustomer, setCurrentCustomer } = useCurrentCustomer();
  const {
    currentCart,
    setCurrentCart,
    carts,
    applyBestPromo,
    setApplyBestPromo,
  } = useCurrentCart();

  const { customers, isLoading } = useCurrentCustomer();

  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.id,
      label: `${customer.firstName} ${customer.lastName} (${
        customer.email || customer.id
      })`,
    }));
  }, [customers]);

  const cartOptions = useMemo(() => {
    return carts?.map((cart) => ({
      value: cart.id,
      label: `${intl.formatMessage(messages.cartQuantity, {
        quantity: cart.totalLineItemQuantity,
      })} - ${convertMoneytoString(cart.totalPrice)} (${cart.id.slice(
        0,
        4
      )}...)`,
    }));
  }, [carts]);

  const handleCustomerSelect = (key: Key | null) => {
    const customerId = key ? String(key) : '';
    if (customerId) {
      const customer = customers.find((c) => c.id === customerId);
      if (customer) {
        setCurrentCustomer(customer);
      }
    } else {
      setCurrentCustomer(null);
      setCurrentCart(null);
    }
  };

  const handleCartSelect = (key: Key | null) => {
    const cartId = key ? String(key) : '';
    const cart = carts?.find((c) => c.id === cartId);
    if (cart) {
      setCurrentCart(cart);
    } else {
      setCurrentCart(null);
    }
  };

  return (
    <Box
      bg="bg"
      padding="600"
      borderRadius="200"
      boxShadow="sm"
      marginBottom="600"
    >
      <Flex align="center" gap="600" wrap="wrap">
        <Box flex="1 1 300px" minWidth="300px">
          <Select.Root
            name="customer-select"
            aria-label={intl.formatMessage(messages.selectCustomer)}
            isClearable
            selectedKey={currentCustomer?.id ?? null}
            onSelectionChange={handleCustomerSelect}
            placeholder={intl.formatMessage(messages.selectCustomer)}
            isDisabled={isLoading}
          >
            <Select.Options>
              {customerOptions.map((option) => (
                <Select.Option key={option.value} id={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select.Options>
          </Select.Root>
        </Box>

        <Box flex="1 1 400px" minWidth="300px">
          <Flex align="center" gap="400">
            <Box flexGrow={1}>
              <Select.Root
                name="cart-select"
                aria-label={intl.formatMessage(messages.selectCart)}
                isClearable
                selectedKey={currentCart?.id ?? null}
                onSelectionChange={handleCartSelect}
                placeholder={intl.formatMessage(messages.selectCart)}
                isDisabled={!currentCustomer}
              >
                <Select.Options>
                  {(cartOptions ?? []).map((option) => (
                    <Select.Option key={option.value} id={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select.Options>
              </Select.Root>
            </Box>
            {!!currentCart && (
              <Box whiteSpace="nowrap">
                <Link
                  href={`${context?.project?.key}/orders/carts/${currentCart?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage(messages.viewCart)}
                </Link>
              </Box>
            )}
          </Flex>
        </Box>

        <Box flexShrink={0}>
          <Checkbox
            value="apply-best-promo"
            isSelected={applyBestPromo}
            onChange={setApplyBestPromo}
          >
            {intl.formatMessage(messages.applyBestPromo)}
          </Checkbox>
        </Box>
      </Flex>
    </Box>
  );
};

CartIdForm.displayName = 'CartIdForm';

export default CartIdForm;
