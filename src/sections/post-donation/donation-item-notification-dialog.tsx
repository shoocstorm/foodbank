import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { DonationItemProps } from 'src/types/donation-types';

type DonationNotificationDialogProps = {
  open: boolean;
  onClose: () => void;
  donation: DonationItemProps;
};

// Successful claim notification dialog
export function DonationNotificationDialog({ open, onClose, donation }: DonationNotificationDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          p: 2
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'scaleIn 0.5s ease-out'
          }}
        >
          <Iconify
            icon="eva:checkmark-fill"
            sx={{
              width: 40,
              height: 40,
              color: 'common.white',
              animation: 'fadeIn 0.5s ease-out 0.2s both'
            }}
          />
        </Box>

        <DialogTitle
          sx={{
            fontSize: 24,
            fontWeight: 700,
            color: 'text.primary',
            textAlign: 'center',
            mb: 2
          }}
        >
          Claim Confirmation
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText
            sx={{
              color: 'text.primary',
              fontSize: 16,
              mb: 2
            }}
          >
            Your claim is confirmed. Please proceed to the pickup location to pick up the item.
          </DialogContentText>

          <Box
            sx={{
              bgcolor: 'primary.lighter',
              borderRadius: 1,
              p: 2,
              mt: 2
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: 'primary.darker', mb: 1 }}
            >
              Collection Code
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: 'primary.dark', letterSpacing: 2 }}
            >
              {donation.collectionCode}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ mt: 3 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Box>

      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </Dialog>
  );
}