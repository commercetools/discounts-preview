import type { Cart } from '@commercetools/platform-sdk';
import { evaluatePredicate } from './evaluator';

const money = (centAmount: number) => ({ centAmount, currencyCode: 'USD' });

// Two units of SKU "A" at 25.00 each: a 50.00 USD cart.
const cart = {
  id: 'cart-1',
  totalPrice: money(5000),
  customLineItems: [],
  lineItems: [
    {
      id: 'line-1',
      quantity: 2,
      variant: { sku: 'A' },
      price: { value: money(2500) },
      totalPrice: money(5000),
    },
  ],
} as unknown as Cart;

describe('evaluatePredicate', () => {
  it('qualifies an empty predicate', async () => {
    expect(await evaluatePredicate('', cart)).toMatchObject({
      isApplicable: true,
      type: 'EMPTY',
      qualificationStatus: 'QUALIFIED',
    });
  });

  describe('cart total', () => {
    it('is QUALIFIED when the threshold is met', async () => {
      expect(
        await evaluatePredicate('totalPrice >= "20.00 USD"', cart)
      ).toMatchObject({
        isApplicable: true,
        qualificationStatus: 'QUALIFIED',
        currentAmount: 50,
        requiredAmount: 20,
      });
    });

    it('is PENDING with the remaining amount when the threshold is not met', async () => {
      expect(
        await evaluatePredicate('totalPrice >= "100.00 USD"', cart)
      ).toMatchObject({
        isApplicable: false,
        qualificationStatus: 'PENDING',
        currentAmount: 50,
        requiredAmount: 100,
        remainingAmount: 50,
      });
    });
  });

  describe('line item count', () => {
    it('is PENDING with the remaining quantity', async () => {
      expect(
        await evaluatePredicate('lineItemCount(sku = "A") >= 5', cart)
      ).toMatchObject({
        isApplicable: false,
        qualificationStatus: 'PENDING',
        currentCount: 2,
        requiredCount: 5,
        remainingCount: 3,
      });
    });

    it('is QUALIFIED when enough items are present', async () => {
      expect(
        await evaluatePredicate('lineItemCount(sku = "A") >= 2', cart)
      ).toMatchObject({
        isApplicable: true,
        qualificationStatus: 'QUALIFIED',
      });
    });
  });

  it('qualifies when a matching line item exists', async () => {
    expect(
      await evaluatePredicate('lineItemExists(sku = "A") = true', cart)
    ).toMatchObject({
      isApplicable: true,
      qualificationStatus: 'QUALIFIED',
    });
  });

  it('is NOT_APPLICABLE for a customer group the cart does not have', async () => {
    expect(
      await evaluatePredicate('customerGroup.key = "vip"', cart)
    ).toMatchObject({
      isApplicable: false,
      qualificationStatus: 'NOT_APPLICABLE',
    });
  });

  describe('combined conditions', () => {
    it('is PENDING while any "and" condition is pending', async () => {
      const result = await evaluatePredicate(
        'totalPrice >= "20.00 USD" and lineItemCount(sku = "A") >= 5',
        cart
      );
      expect(result).toMatchObject({
        isApplicable: false,
        type: 'COMBINED',
        qualificationStatus: 'PENDING',
      });
    });

    it('is QUALIFIED when every "and" condition is met', async () => {
      const result = await evaluatePredicate(
        'totalPrice >= "20.00 USD" and lineItemCount(sku = "A") >= 2',
        cart
      );
      expect(result.isApplicable).toBe(true);
    });
  });

  it('returns UNKNOWN instead of throwing for an unparseable predicate', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const result = await evaluatePredicate('nonsense ((', cart);
    consoleError.mockRestore();

    expect(result).toMatchObject({
      isApplicable: false,
      type: 'PARSE_ERROR',
      qualificationStatus: 'UNKNOWN',
    });
  });
});
