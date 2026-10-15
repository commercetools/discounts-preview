import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Box,
  Flex,
  LoadingSpinner,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import { useCurrentCart, usePromotionContext } from '../../contexts';
import { PromotionWithValue, usePromotions } from '../../hooks/use-promotions';
import ListPagination from '../list-pagination';
import PanelHeader from '../panel-header';
import messages from './messages';
import PromotionCard from './promotion-card';

const AvailablePromotions: React.FC = () => {
  const intl = useIntl();
  const { currentCart, applyBestPromo, applyDiscountCode } = useCurrentCart();
  const {
    promotions,
    isLoading,
    page,
    limit,
    total,
    onPageChange,
    onPageSizeChange,
  } = usePromotionContext();
  const { calculatePromotionValues } = usePromotions();
  const [promotionsWithValues, setPromotionsWithValues] = useState<
    PromotionWithValue[]
  >([]);
  useEffect(() => {
    if (!currentCart) return;
    calculatePromotionValues(promotions, currentCart).then(
      (promotionsWithValues) => {
        setPromotionsWithValues(promotionsWithValues);
        if (applyBestPromo) {
          const bestPromo = promotionsWithValues.find(
            (promo) => promo.isApplicable
          );
          if (bestPromo) {
            applyDiscountCode(bestPromo.code);
          }
        }
      }
    );
  }, [promotions, currentCart]);

  return (
    <Accordion.Root defaultExpandedKeys={['available-promotions']}>
      <Accordion.Item value="available-promotions">
        <PanelHeader
          title={intl.formatMessage(messages.headerTitle)}
          subtitle={intl.formatMessage(messages.infoDescription1)}
        />
        <Accordion.Content>
          <Box w="100%">
            {isLoading ? (
              <Flex p="600" justify="center" align="center" gap="200">
                <LoadingSpinner size="lg" />
                <Text>{intl.formatMessage(messages.loadingDiscounts)}</Text>
              </Flex>
            ) : promotionsWithValues.length === 0 ? (
              <Box p="600" textAlign="center" color="neutral.11">
                <Text>{intl.formatMessage(messages.noDiscountsAvailable)}</Text>
              </Box>
            ) : (
              <Stack gap="300">
                <Text fontSize="300" color="neutral.11">
                  {intl.formatMessage(messages.infoDescription2)}
                </Text>
                {promotionsWithValues
                  .filter((promo) => promo.isApplicable)
                  .map((promo, index) => (
                    <PromotionCard
                      key={promo.id}
                      promo={promo}
                      isBestDeal={index === 0}
                    />
                  ))}
                <Accordion.Root>
                  <Accordion.Item value="not-applicable-promotions">
                    <PanelHeader
                      size="sm"
                      title={intl.formatMessage(
                        messages.notApplicablePromotions
                      )}
                    />
                    <Accordion.Content>
                      <Stack gap="300" w="100%" pr="400">
                        {promotionsWithValues
                          .filter((promo) => !promo.isApplicable)
                          .map((promo, index) => (
                            <PromotionCard
                              key={promo.id}
                              promo={promo}
                              isBestDeal={index === 0}
                            />
                          ))}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
                <ListPagination
                  label={intl.formatMessage(messages.paginationLabel)}
                  total={total}
                  page={page}
                  pageSize={limit}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              </Stack>
            )}
          </Box>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

AvailablePromotions.displayName = 'AvailablePromotions';

export default AvailablePromotions;
