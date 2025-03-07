import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type DonationItemProps = {
  id: string;
  name: string;
  address: string;
  publishedAt: string;
  price: number;
  status: string;
  coverUrl: string;
  colors: string[];
  priceSale: number | null;
};

export function DonationItem({ donation, onClick }: { donation: DonationItemProps, onClick?: () => void }) {
  const renderStatus = (
    <Label
      variant="inverted"
      color={(donation.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {donation.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={donation.name}
      src={donation.coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {donation.priceSale && fCurrency(donation.priceSale)}
      </Typography>
      &nbsp;
      Free
      {/* {fCurrency(product.price)} */}
    </Typography>
  );

  return (
    <Card onClick={onClick}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {donation.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {donation.name}
        </Link>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={product.colors} /> */}
          {donation.address}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1, fontSize: 12, color: 'text.secondary' }}>          
         Published at: {donation.publishedAt}
        </Box>
      </Stack>
    </Card>
  );
}
