import React from 'react';
import { Accordion, Flex, Stack, Text } from '@commercetools/nimbus';

type TPanelHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Optional badge shown next to the title. */
  badge?: React.ReactNode;
  size?: 'md' | 'sm';
};

/**
 * Shared header for every collapsible panel, so title color, size and the
 * sub-headline are rendered the same way everywhere.
 */
const PanelHeader = ({
  title,
  subtitle,
  badge,
  size = 'md',
}: TPanelHeaderProps) => (
  <Accordion.Header>
    <Stack gap="100" align="flex-start">
      <Flex align="center" gap="200">
        <Text
          fontWeight="600"
          color="primary.11"
          fontSize={size === 'sm' ? '300' : undefined}
        >
          {title}
        </Text>
        {badge}
      </Flex>
      {subtitle && (
        <Text fontSize="300" fontWeight="400" color="neutral.11">
          {subtitle}
        </Text>
      )}
    </Stack>
  </Accordion.Header>
);
PanelHeader.displayName = 'PanelHeader';

export default PanelHeader;
