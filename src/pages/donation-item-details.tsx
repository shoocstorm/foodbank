import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { DonationStatus, type DonationItemProps } from 'src/types/donation-types';
import { auth, useDonations, useClaimUnClaim, useConfirmPickup } from 'src/hooks/use-firebase';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { donations } = useDonations();
  const { updateStatus } = useClaimUnClaim();
  const [donation, setDonation] = useState<DonationItemProps | null>(null);
  const [isNotificationDialogOpen, setOpenNotificationDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [confirming, setConfirming] = useState(false);
  const { updatePickupStatus } = useConfirmPickup();

  const handleUndoClaim = async () => {
    if (!donation || undoing) return;

    setUndoing(true);
    const success = await updateStatus(donation.id, 'ACTIVE', '');
    setUndoing(false);

    setSnackbar({
      open: true,
      message: success ? 'Successfully unclaimed the donation.' : 'Failed to undo claim. Please try again.',
      severity: success ? 'success' : 'error'
    });
  };

  const handleClickClaim = async () => {
    if (!donation || updating) return;

    setUpdating(true);
    const collectionCode = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const success = await updateStatus(donation.id, 'CLAIMED', collectionCode);
    setUpdating(false);

    if (success) {
      setOpenNotificationDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to claim the donation. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotificationDialog = () => {
    setOpenNotificationDialog(false);
  };

  useEffect(() => {
    if (donations) {
      const fetched = donations.find((item) => item.id === id);
      if (fetched) {
        fetched.photo = fetched.photo || '/assets/images/food-placeholder.png';
        setDonation(fetched);
      } else {
        setDonation(null);
      }
    }
  }, [id, donations]);

  if (!donation) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Helmet>
        <title> {`Donation Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

        {/* Donation Status Milestone Diagram */}
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
            {donation.status !== DonationStatus.EXPIRED ? (
              <>
                <Typography variant="caption" color="text.secondary">Claimed</Typography>
                <Typography variant="caption" color="text.secondary">Picked Up</Typography>
              </>
            ) : (
              <Typography variant="caption" color="error.main">Expired</Typography>
            )}
          </Stack>
        </Box>

        {/* Donation Title */}
        <Typography variant="h4" gutterBottom>{donation.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography fontSize={10} color="text.secondary">Published At:</Typography>
          <Typography fontSize={10} color="text.secondary">{new Date(donation.creationTime).toLocaleString()}</Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>

          {/* Card Photo & Status */}
          <Grid xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {donation.status && (
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
              )}
              <Box
                component="img"
                src={donation.photo}
                alt={donation.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
            </Box>
          </Grid>


          {/* Donation Details & Buttons */}
          <Grid xs={12} md={6}>
            <Stack spacing={2}>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography fontSize={14} color="text.secondary">Status:</Typography>
                  <Typography>{donation.status} {donation.status === 'CLAIMED' && donation.claimedBy === auth.currentUser?.uid && '(by you)' || ' (by other user)'}</Typography>
                </Box>
                {donation.claimedBy === auth.currentUser?.uid && (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography fontSize={14} color="text.secondary">Collection Code:</Typography>
                    <Typography fontWeight="bold" sx={{ textDecoration: donation.status === DonationStatus.PICKED_UP ? 'line-through' : 'none' }}>{donation.collectionCode}</Typography>
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

              {/* Action Buttons */}
              {donation.status === 'ACTIVE' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickClaim}
                  disabled={updating}
                  fullWidth
                  startIcon={<Iconify icon="ic:round-shopping-cart" />}
                  sx={{ maxWidth: { sm: 200 } }}
                >
                  {updating ? 'Processing...' : 'Claim'}
                </Button>
              )}

              {donation.status === 'CLAIMED' && (
                <>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleUndoClaim}
                    disabled={undoing || donation.claimedBy !== auth.currentUser?.uid}
                    fullWidth
                    startIcon={<Iconify icon="material-symbols:undo" />}
                    sx={{ maxWidth: { sm: 200 } }}
                  >
                    {undoing ? 'Processing...' : 'Undo Claim'}
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setConfirming(true);
                      const success = await updatePickupStatus(donation.id, DonationStatus.PICKED_UP);
                      setConfirming(false);
                      setSnackbar({
                        open: true,
                        message: success ? 'Pickup confirmed successfully.' : 'Failed to confirm pickup. Please try again.',
                        severity: success ? 'success' : 'error'
                      });
                    }}
                    disabled={confirming || donation.claimedBy !== auth.currentUser?.uid}
                    fullWidth
                    startIcon={<Iconify icon="material-symbols:check-circle" />}
                    sx={{ maxWidth: { sm: 200 } }}
                  >
                    {confirming ? 'Processing...' : 'Confirm Pickup'}
                  </Button>

                </>
              )}

              {donation.status === DonationStatus.PICKED_UP && donation.claimedBy === auth.currentUser?.uid && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={async () => {
                    setConfirming(true);
                    const success = await updatePickupStatus(donation.id, DonationStatus.CLAIMED);
                    setConfirming(false);
                    setSnackbar({
                      open: true,
                      message: success ? 'Pickup status reverted successfully.' : 'Failed to revert pickup status. Please try again.',
                      severity: success ? 'success' : 'error'
                    });
                  }}
                  disabled={confirming}
                  fullWidth
                  startIcon={<Iconify icon="material-symbols:undo" />}
                  sx={{ maxWidth: { sm: 200 } }}
                >
                  {confirming ? 'Processing...' : 'Undo Pickup'}
                </Button>
              )}
            </Stack>
          </Grid>

        </Grid>
      </Box>

      {/* Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onClose={handleCloseNotificationDialog}>
        <DialogTitle>Claim Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your claim is confirmed. Please proceed to the pickup location to pick up the item.
          </DialogContentText>
          <DialogContentText>
            Collection Code: {donation.collectionCode}
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotificationDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


