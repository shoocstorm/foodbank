import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DonationItemProps, DonationStatus } from 'src/types/donation-types';
import { auth } from 'src/hooks/use-firebase';

type DonationDetailsProps = {
  donation: DonationItemProps;
};

export function DonationItemDetailsSection({ donation }: DonationDetailsProps) {
  return (
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography fontSize={14} color="text.secondary">Status:</Typography>
          <Typography>
            {donation.status}{' '}
            {donation.status === 'CLAIMED' && (
              donation.claimedBy === auth.currentUser?.uid ? '(by you)' : '(by other user)'
            )}
          </Typography>
        </Box>

        {donation.claimedBy === auth.currentUser?.uid && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography fontSize={14} color="text.secondary">Collection Code:</Typography>
            <Typography
              fontWeight="bold"
              sx={{ textDecoration: donation.status === DonationStatus.PICKED_UP ? 'line-through' : 'none' }}
            >
              {donation.collectionCode}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography fontSize={14} color="text.secondary">Address:</Typography>
          <Typography>{donation.address}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography fontSize={14} color="text.secondary">Weight:</Typography>
          <Typography>{donation.weight} (kg)</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography fontSize={14} color="text.secondary">Expiry:</Typography>
          <Typography>
            {(() => {
              const now = new Date().getTime();
              const creationTime = donation.creationTime;
              const expiryMillis = (donation.expiry * 60 * 60 * 1000);
              const remainingMillis = (creationTime + expiryMillis) - now;

              if (remainingMillis <= 0) {
                return 'Expired';
              }

              const remainingHours = Math.floor(remainingMillis / (60 * 60 * 1000));
              const remainingMinutes = Math.floor((remainingMillis % (60 * 60 * 1000)) / (60 * 1000));

              return `in ${remainingHours} hours ${remainingMinutes} minutes`;
            })()}
          </Typography>
        </Box>

        {donation.claimedBy === auth.currentUser?.uid && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography color="text.secondary">Contact:</Typography>
            <Typography>{donation.contactPerson} {donation.contactPhone}</Typography>
          </Box>
        )}
      </Stack>
  );
}