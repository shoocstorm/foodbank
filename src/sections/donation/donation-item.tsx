import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { User } from 'src/contexts/user-context';
import { auth } from 'src/hooks/use-firebase';
import { DonationStatus, DonationItemProps } from 'src/types/donation-types';

// ----------------------------------------------------------------------

export function DonationItem({ donation, user, onClick }: { donation: DonationItemProps, user: User | null, onClick?: () => void }) {
  const renderStatus = (
    <Label
      variant="inverted"
      color={(donation.status === DonationStatus.ACTIVE && 'primary') || (donation.status === DonationStatus.CLAIMED && 'info') || (donation.status === DonationStatus.PICKED_UP && 'success') || 'info'}
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
      alt={donation.title}
      src={donation.photo || '/assets/images/food-placeholder.png'}
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
        {donation.expiry}
      </Typography>
      &nbsp;
      Free
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
          {donation.title}
        </Link>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          ⚲&nbsp;{donation.address}
        </Box>
        {donation.claimedBy === auth.currentUser?.uid ? (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {donation.contactPerson} {donation.contactPhone}
          </Box>
        ) : (<Box />)
        }

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1, fontSize: 12, color: 'text.secondary' }}>
          Published by: {donation.createdBy === user?.uid ? 'You' : donation.createdBy}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1, fontSize: 12, color: 'text.secondary' }}>
          Published at: {new Date(donation.creationTime).toLocaleString()}
        </Box>
      </Stack>
    </Card>
  );
}
