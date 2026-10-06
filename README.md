# Discounts Preview

> **commercetools-labs reference code. Freely available under the MIT license, AS IS and
> UNSUPPORTED:** commercetools offers no support, maintenance or warranty for it. See
> [SUPPORT.md](SUPPORT.md) and [LICENSE](LICENSE).

Business-user tooling for commercetools discounts: a Merchant Center Custom
Application that shows a merchandiser how discounts apply to a customer's cart,
deployed with commercetools Connect.

Pick a customer and one of their active carts. The app shows which cart discounts
already apply, which are close but not yet qualified, and which discount codes are
worth giving the shopper. What each part does, with pointers to the code:
[FEATURES.md](FEATURES.md).

## Layout

| Path | What it is |
| --- | --- |
| `merchant-center-custom-application/` | The Merchant Center Custom Application (React, TypeScript, `@commercetools-frontend` application kit) |
| `connect.yaml` | The Connect deployment descriptor: one `merchant-center-custom-application` |
| `FEATURES.md` | What the app implements, with file paths |

There is no backend. The app runs in the merchandiser's Merchant Center session and
reaches the commercetools APIs through the Merchant Center API proxy.

## Quick start

Needs Node.js 22 (see `.nvmrc`) and Yarn.

```bash
cd merchant-center-custom-application
yarn install
cp .env.example .env     # then fill in your own values
yarn start               # http://localhost:3001
```

```bash
yarn typecheck           # tsc --noEmit
yarn test                # unit tests, including the predicate evaluator
yarn lint
```

`.env` is read by `custom-application-config.mjs` and is never committed. For local
development you need a commercetools project you can sign in to, and the project key in
`INITIAL_PROJECT_KEY`.

## What it does

- **Applied discounts.** Every product discount and cart discount on the cart, with a
  per-line-item breakdown and cart totals before and after discounts.
- **Auto-triggered discounts.** Every cart discount that does not require a code, grouped
  as qualified, pending or not applicable by evaluating its `cartPredicate` against the
  cart in the browser. Pending discounts say what is missing, such as "Spend $20.00 more
  on Shoes products to qualify".
- **Available discount codes.** Every active discount code, ranked by what it would
  actually save on this cart. The value is measured on a throwaway shadow cart that the
  app creates and deletes, so the shopper's cart is not touched.
- **All Discounts.** A second screen listing every product discount and cart discount in
  the project.

The real cart is changed only by actions the merchandiser takes: changing a line item's
quantity, applying or removing a discount code, and the "Apply best promo" toggle. These
need the `manage` scopes below.

The predicate evaluator is a reimplementation of the cart predicate language, so it can
differ from the platform. Known gaps are listed in [FEATURES.md](FEATURES.md): custom
line item functions and customer group conditions are not evaluated, and category
conditions only resolve when the cart's line items carry category data.

## Configuration

Configuration is the `connect.yaml` keys below, which Connect turns into the environment
variables that `custom-application-config.mjs` reads.

| Variable | Description | Required | Default |
| --- | --- | --- | --- |
| `CUSTOM_APPLICATION_ID` | The Application ID, issued when you register the Custom Application in the Merchant Center | Yes | - |
| `CLOUD_IDENTIFIER` | The Region the Custom Application connects to, such as `gcp-us`, `gcp-eu` or `aws-fra`. It must match your project's Region | No | `gcp-us` |
| `ENTRY_POINT_URI_PATH` | The Application entry point URI path, as registered. Unique per Region | Yes | `discounts-preview` |

`APPLICATION_URL` is provided by Connect and is not declared in `connect.yaml`. It is in
`.env.example` only so a local production build can run. `INITIAL_PROJECT_KEY` is
used by `yarn start` and is not a deployment setting.

The app requests these OAuth scopes (`custom-application-config.mjs`):

| Permission | Scopes |
| --- | --- |
| `view` | `view_products`, `view_customers`, `view_cart_discounts`, `view_discount_codes`, `view_orders` |
| `manage` | `manage_cart_discounts`, `manage_discount_codes`, `manage_orders` |

## Deploy with Connect

1. In the Merchant Center, register a Custom Application with a placeholder URL. Note
   its **Application ID** and set its **entry point URI path** (`discounts-preview`).
2. Push this repository to GitHub and create a release with a Git tag.
3. Create a Connector that points at the repository and tag, then publish it with
   preview or publish for private use. This can be done in the Merchant Center (an
   Organization Connector) or with the Connect API. A private repository needs read access
   granted to the [connect-mu](https://github.com/connect-mu) machine user.
4. Deploy or install the Connector in a project in the same Region, supplying
   `CUSTOM_APPLICATION_ID`, `ENTRY_POINT_URI_PATH` and `CLOUD_IDENTIFIER`.
5. Copy the deployed application's URL and set it as the Application URL of the Custom
   Application in the Merchant Center.
6. Install the Custom Application in the project and open it from the main menu.

Merchandisers need the `view` permission to see the app and `manage` to change carts.
Both are assigned per Custom Application in the Merchant Center.

## References

- [Deploy a Custom Application to Connect](https://docs.commercetools.com/merchant-center-customizations/deployment/commercetools-connect)
- [Custom Applications](https://docs.commercetools.com/merchant-center-customizations/custom-applications)
- [Custom Application config](https://docs.commercetools.com/merchant-center-customizations/tooling-and-configuration/custom-application-config)
- [Connect overview](https://docs.commercetools.com/connect/overview)
- [Cart Discounts API](https://docs.commercetools.com/api/projects/cartDiscounts)
- [Discount Codes API](https://docs.commercetools.com/api/projects/discountCodes)
