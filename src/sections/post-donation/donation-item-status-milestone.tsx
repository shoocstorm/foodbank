import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DonationItemProps, DonationStatus } from 'src/types/donation-types';
import { Iconify } from 'src/components/iconify';
import { auth } from 'src/hooks/use-firebase';

export function DonationStatusMilestone({ donation }: { donation: DonationItemProps }) {
  return (
    <Box sx={{ mb: 4 }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes ripple {
            0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
            100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
          }
      `}
      </style>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%', py: 3 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600
          }}
        >
          {/* Active Node */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: donation.status === DonationStatus.ACTIVE ? 'primary.main' :
                (donation.status === DonationStatus.CLAIMED || donation.status === DonationStatus.PICKED_UP) ? 'success.main' :
                  donation.status === DonationStatus.EXPIRED ? 'error.main' : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Iconify icon="material-symbols:inventory-2" width={24} />
          </Box>
          {/* Connector Line */}
          <Box
            sx={{
              flex: 1,
              height: 4,
              bgcolor: donation.status === DonationStatus.ACTIVE ? 'grey.300' :
                (donation.status === DonationStatus.CLAIMED || donation.status === DonationStatus.PICKED_UP) ? 'success.main' :
                  donation.status === DonationStatus.EXPIRED ? 'error.main' : 'grey.300'
            }}
          />
          {donation.status !== DonationStatus.EXPIRED ? (
            <>
              {/* Claimed Node */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: donation.status === DonationStatus.CLAIMED ? 'primary.main' :
                    donation.status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  animation: donation.status === DonationStatus.ACTIVE ? 'pulse 1s 3' : 'none',
                  boxShadow: donation.status === DonationStatus.ACTIVE ? '0 0 0 rgba(25, 118, 210, 0.4)' : 'none',
                  '&::after': donation.status === DonationStatus.ACTIVE ? {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: 'ripple 1s 3'
                  } : {}
                }}
              >
                <Iconify icon="material-symbols:shopping-cart" width={24} />
              </Box>
              {/* Connector Line */}
              <Box
                sx={{
                  flex: 1,
                  height: 4,
                  bgcolor: donation.status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300'
                }}
              />
              {/* Picked Up Node */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: donation.status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  animation: donation.claimedBy === auth.currentUser?.uid && donation.status === DonationStatus.CLAIMED ? 'pulse 2s infinite' : 'none',
                  boxShadow: donation.claimedBy === auth.currentUser?.uid && donation.status === DonationStatus.CLAIMED ? '0 0 0 rgba(25, 118, 210, 0.4)' : 'none',
                  '&::after': donation.claimedBy === auth.currentUser?.uid && donation.status === DonationStatus.CLAIMED ? {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: 'ripple 2s infinite'
                  } : {}
                }}
              >
                <Iconify icon="material-symbols:check-circle" width={24} />
              </Box>
            </>
          ) : (
            /* Expired Node */
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                position: 'relative',
                zIndex: 1
              }}
            >
              <Iconify icon="material-symbols:error" width={24} />
            </Box>
          )}
        </Box>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%', maxWidth: 600, mx: 'auto', px: 2 }}
      >
        <Typography variant="caption" color="text.secondary">Active</Typography>
        {donation.status !== DonationStatus.EXPIRED ? (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ pl: 0 }}>{donation.status === DonationStatus.ACTIVE ? 'Claim' : 'Claimed'}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ pl: 0 }}>{donation.status !== DonationStatus.PICKED_UP ? 'Pickup' : 'Picked Up'}</Typography>
          </>
        ) : (
          <Typography variant="caption" color="error.main">Expired</Typography>
        )}
      </Stack>
    </Box>
  );
}
