import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DonationStatus } from 'src/types/donation-types';
import { Iconify } from 'src/components/iconify';

type DonationStatusMilestoneProps = {
  status: DonationStatus;
};

export function DonationStatusMilestone({ status }: DonationStatusMilestoneProps) {
  return (
    <Box sx={{ mb: 4 }}>
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
              bgcolor: status === DonationStatus.ACTIVE ? 'primary.main' :
                (status === DonationStatus.CLAIMED || status === DonationStatus.PICKED_UP) ? 'success.main' :
                  status === DonationStatus.EXPIRED ? 'error.main' : 'grey.300',
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
              bgcolor: status === DonationStatus.ACTIVE ? 'grey.300' :
                (status === DonationStatus.CLAIMED || status === DonationStatus.PICKED_UP) ? 'success.main' :
                  status === DonationStatus.EXPIRED ? 'error.main' : 'grey.300'
            }}
          />
          {status !== DonationStatus.EXPIRED ? (
            <>
              {/* Claimed Node */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: status === DonationStatus.CLAIMED ? 'primary.main' :
                    status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Iconify icon="material-symbols:shopping-cart" width={24} />
              </Box>
              {/* Connector Line */}
              <Box
                sx={{
                  flex: 1,
                  height: 4,
                  bgcolor: status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300'
                }}
              />
              {/* Picked Up Node */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: status === DonationStatus.PICKED_UP ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1
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
        {status !== DonationStatus.EXPIRED ? (
          <>
            <Typography variant="caption" color="text.secondary">Claimed</Typography>
            <Typography variant="caption" color="text.secondary">Picked Up</Typography>
          </>
        ) : (
          <Typography variant="caption" color="error.main">Expired</Typography>
        )}
      </Stack>
    </Box>
  );
}