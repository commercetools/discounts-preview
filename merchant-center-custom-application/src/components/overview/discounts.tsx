import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  Alert,
  Badge,
  Box,
  DataTable,
  Heading,
  LoadingSpinner,
  Pagination,
  Stack,
  type DataTableColumnItem,
  type DataTableRowItem,
  type SortDescriptor,
} from '@commercetools/nimbus';
import { CheckCircle, RadioButtonUnchecked } from '@commercetools/nimbus-icons';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  CartDiscount,
  LocalizedString,
  PagedQueryResponse,
  ProductDiscount,
} from '@commercetools/platform-sdk';
import { useCartDiscounts } from '../../hooks/use-cart-discounts';
import { useLocalizedString } from '../../hooks/use-localization';
import { useProductDiscounts } from '../../hooks/use-product-discounts';
import messages from './messages';

type TDiscountRow = {
  id: string;
  type: 'product' | 'cart';
  key?: string | null;
  name?: LocalizedString;
  isActive: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
  createdAt: string;
};

type TSorting = { key: string; order: 'asc' | 'desc' };

const PER_PAGE_OPTIONS = [20, 50, 100];

type TDiscountsProps = {
  linkToWelcome: string;
};

const Discounts = (_props: TDiscountsProps) => {
  const intl = useIntl();
  const { getCartDiscounts } = useCartDiscounts();
  const { getProductDiscounts } = useProductDiscounts();
  const { push } = useHistory();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS[0]);
  const { convertLocalizedString } = useLocalizedString();
  const [sorting, setSorting] = useState<TSorting>({
    key: 'createdAt',
    order: 'desc',
  });
  const { dataLocale, projectLanguages, projectKey } = useApplicationContext(
    (context) => ({
      dataLocale: context.dataLocale,
      projectLanguages: context.project?.languages,
      projectKey: context.project?.key,
    })
  );

  const [cartDiscountsPaginatedResult, setCartDiscountsPaginatedResult] =
    useState<PagedQueryResponse>();
  const [cartDiscountsError, setCartDiscountsError] = useState<string | null>(
    null
  );
  const [cartDiscountsLoading, setCartDiscountsLoading] = useState(false);
  const [productDiscountsPaginatedResult, setProductDiscountsPaginatedResult] =
    useState<PagedQueryResponse>();
  const [productDiscountsError, setProductDiscountsError] = useState<
    string | null
  >(null);
  const [productDiscountsLoading, setProductDiscountsLoading] = useState(false);

  const combinedDiscounts = useMemo(() => {
    const productDiscounts: TDiscountRow[] =
      (productDiscountsPaginatedResult?.results as ProductDiscount[])?.map(
        (discount) => ({
          id: discount.id,
          type: 'product' as const,
          key: discount.key,
          name: discount.name,
          isActive: discount.isActive,
          validFrom: discount.validFrom,
          validUntil: discount.validUntil,
          createdAt: discount.createdAt,
        })
      ) || [];

    const cartDiscounts: TDiscountRow[] =
      (cartDiscountsPaginatedResult?.results as CartDiscount[])?.map(
        (discount) => ({
          id: discount.id,
          type: 'cart' as const,
          key: discount.key,
          name: discount.name,
          isActive: discount.isActive,
          validFrom: discount.validFrom,
          validUntil: discount.validUntil,
          createdAt: discount.createdAt,
        })
      ) || [];

    return [...productDiscounts, ...cartDiscounts].sort((a, b) => {
      const key = sorting.key;
      const order = sorting.order;

      let comparison = 0;
      if (key === 'createdAt' || key === 'validFrom' || key === 'validUntil') {
        const aValue = a[key as keyof TDiscountRow] as
          | string
          | null
          | undefined;
        const bValue = b[key as keyof TDiscountRow] as
          | string
          | null
          | undefined;
        comparison = (aValue || '').localeCompare(bValue || '');
      } else if (key === 'name') {
        const aName = convertLocalizedString(a.name);
        const bName = convertLocalizedString(b.name);
        comparison = aName.localeCompare(bName);
      } else if (key === 'key') {
        comparison = (a.key || '').localeCompare(b.key || '');
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }, [
    productDiscountsPaginatedResult,
    cartDiscountsPaginatedResult,
    sorting,
    dataLocale,
    projectLanguages,
  ]);

  const minimunItems = useMemo(
    () =>
      Math.min(
        productDiscountsPaginatedResult?.total || 0,
        cartDiscountsPaginatedResult?.total || 0
      ),
    [productDiscountsPaginatedResult, cartDiscountsPaginatedResult]
  );

  const loading = productDiscountsLoading || cartDiscountsLoading;
  const error = productDiscountsError || cartDiscountsError;

  useEffect(() => {
    setCartDiscountsLoading(true);
    setProductDiscountsLoading(true);
    getCartDiscounts(undefined, perPage, (page - 1) * perPage, sorting)
      .then(setCartDiscountsPaginatedResult)
      .catch((err) => setCartDiscountsError(err.message))
      .finally(() => setCartDiscountsLoading(false));

    getProductDiscounts(undefined, perPage, (page - 1) * perPage, sorting)
      .then(setProductDiscountsPaginatedResult)
      .catch((err) => setProductDiscountsError(err.message))
      .finally(() => setProductDiscountsLoading(false));
  }, [page, perPage, sorting.key, sorting.order]);

  if (error) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{error}</Alert.Description>
      </Alert.Root>
    );
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return NO_VALUE_FALLBACK;
    return intl.formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRowClick = (row: DataTableRowItem<TDiscountRow>) => {
    if (row.type === 'product') {
      push(`/${projectKey}/discounts/products/${row.id}`);
    } else {
      push(`/${projectKey}/discounts/carts/${row.id}`);
    }
  };

  // Accessors return raw, sortable values: the table re-sorts client-side by accessor.
  const columns: DataTableColumnItem<TDiscountRow>[] = [
    {
      id: 'name',
      header: 'Name',
      defaultWidth: 280,
      minWidth: 120,
      accessor: (row) => convertLocalizedString(row.name),
      isRowHeader: true,
    },
    {
      id: 'key',
      header: 'Key',
      defaultWidth: 220,
      minWidth: 120,
      accessor: (row) => row.key || '',
      render: ({ row }) => row.key || NO_VALUE_FALLBACK,
      isSortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row) => row.type,
      render: ({ row }) => (
        <Badge
          size="2xs"
          colorPalette={row.type === 'product' ? 'primary' : 'neutral'}
        >
          {row.type}
        </Badge>
      ),
    },
    {
      id: 'isActive',
      header: 'Active',
      accessor: (row) => (row.isActive ? 1 : 0),
      render: ({ row }) =>
        row.isActive ? (
          <Box color="positive.11">
            <CheckCircle />
          </Box>
        ) : (
          <Box color="neutral.9">
            <RadioButtonUnchecked />
          </Box>
        ),
      isSortable: true,
    },
    {
      id: 'validFrom',
      header: 'Valid From',
      accessor: (row) => row.validFrom || '',
      render: ({ row }) => formatDate(row.validFrom),
    },
    {
      id: 'validUntil',
      header: 'Valid To',
      accessor: (row) => row.validUntil || '',
      render: ({ row }) => formatDate(row.validUntil),
    },
    {
      id: 'createdAt',
      header: 'Date Created',
      accessor: (row) => row.createdAt,
      render: ({ row }) => formatDate(row.createdAt),
      isSortable: true,
    },
  ];

  const sortDescriptor: SortDescriptor = {
    column: sorting.key,
    direction: sorting.order === 'asc' ? 'ascending' : 'descending',
  };

  return (
    <Box bg="neutral.2" minHeight="100vh" padding="500">
      <Stack gap="300">
        <Heading as="h1">{intl.formatMessage(messages.title)}</Heading>

        {loading && <LoadingSpinner />}

        {!loading && combinedDiscounts.length > 0 ? (
          <Stack gap="300">
            <DataTable<TDiscountRow>
              density="condensed"
              allowsSorting
              allowsPinning={false}
              isTruncated
              columns={columns}
              rows={combinedDiscounts}
              sortDescriptor={sortDescriptor}
              onSortChange={(descriptor) =>
                setSorting({
                  key: String(descriptor.column),
                  order: descriptor.direction === 'ascending' ? 'asc' : 'desc',
                })
              }
              onRowClick={handleRowClick}
            />
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              pageSize={perPage}
              onPageSizeChange={(size) => {
                setPerPage(size);
                setPage(1);
              }}
              pageSizeOptions={PER_PAGE_OPTIONS}
              enablePageSizeSelector
              totalItems={minimunItems}
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};
Discounts.displayName = 'Discounts';

export default Discounts;
