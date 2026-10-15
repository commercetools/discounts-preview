import React from 'react';
import { Box, Flex, Pagination, Separator, Text } from '@commercetools/nimbus';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type TListPaginationProps = {
  /** What is being paged, e.g. "Discount codes". Shown with the total on the left. */
  label: React.ReactNode;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const ListPagination = ({
  label,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TListPaginationProps) => (
  <Box w="100%" pt="300" pb="500">
    <Separator />
    <Flex w="100%" justify="space-between" align="center" pt="300" gap="400">
      <Text fontSize="300" color="neutral.11" whiteSpace="nowrap">
        {label}: {total}
      </Text>
      {/* Keep the "items per page" label on one line. */}
      <Box whiteSpace="nowrap" flexShrink={0}>
        <Pagination
          totalItems={total}
          currentPage={page}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          enablePageSizeSelector
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
    </Flex>
  </Box>
);
ListPagination.displayName = 'ListPagination';

export default ListPagination;
