import { Box, Heading, Stack } from '@commercetools/nimbus';
import { useIntl } from 'react-intl';
import messages from './messages';

const Welcome = () => {
  const intl = useIntl();
  return (
    <Box maxWidth="1024px">
      <Stack gap="600">
        <Heading as="h1">{intl.formatMessage(messages.title)}</Heading>
      </Stack>
    </Box>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
