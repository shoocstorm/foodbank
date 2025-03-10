import Button from '@mui/material/Button';
import { useState } from 'react';

import { DonationStatus, DonationItemProps } from 'src/types/donation-types';
import { Iconify } from 'src/components/iconify';
import { auth, useClaimUnClaim, useConfirmPickup, useDuplicateDonation } from 'src/hooks/use-firebase';
import { Box } from '@mui/material';

type DonationActionsProps = {
  donation: DonationItemProps;
  onStatusChange: () => void;
  onOpenDeleteDialog: () => void;
  onOpenNotificationDialog: () => void;
  onSetSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
};

export function DonationActions({
  donation,
  onStatusChange,
  onOpenDeleteDialog,
  onOpenNotificationDialog,
  onSetSnackbar,
}: DonationActionsProps) {
  const { updateStatus } = useClaimUnClaim();
  const { updatePickupStatus } = useConfirmPickup();
  const { duplicateDonation } = useDuplicateDonation();
  const [updating, setUpdating] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  // Claim donation
  const handleClickClaim = async () => {
    if (!donation || updating) return;

    setUpdating(true);
    const collectionCode = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const { result, message } = await updateStatus(donation.id, DonationStatus.CLAIMED, collectionCode);
    setUpdating(false);

    if (result) {
      onStatusChange();
      onOpenNotificationDialog();
    } else {
      onSetSnackbar(message || 'Failed to claim the donation. Please try again.', 'error');
    }
  };

  // Undo claim
  const handleUndoClaim = async () => {
    if (!donation || undoing) return;

    setUndoing(true);
    const { result, message } = await updateStatus(donation.id, DonationStatus.ACTIVE, '');
    setUndoing(false);

    if (result) {
      onStatusChange();
      onSetSnackbar('Successfully unclaimed the donation.', 'success');
    } else {
      onSetSnackbar(message || 'Failed to undo claim. Please try again.', 'error');
    }
  };

  // Confirm pickup
  const handleConfirmPickup = async () => {
    if (!donation || confirming) return;

    setConfirming(true);
    const success = await updatePickupStatus(donation.id, DonationStatus.PICKED_UP);
    setConfirming(false);

    if (success) {
      onStatusChange();
      onSetSnackbar('Pickup confirmed successfully.', 'success');
    } else {
      onSetSnackbar('Failed to confirm pickup. Please try again.', 'error');
    }
  };

  // Undo pickup
  const handleUndoPickup = async () => {
    if (!donation || confirming) return;

    setConfirming(true);
    const success = await updatePickupStatus(donation.id, DonationStatus.CLAIMED);
    setConfirming(false);

    if (success) {
      onStatusChange();
      onSetSnackbar('Pickup status reverted successfully.', 'success');
    } else {
      onSetSnackbar('Failed to revert pickup status. Please try again.', 'error');
    }
  };

  // Render claim button
  if (donation.status === DonationStatus.ACTIVE) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 2, justifyContent: 'space-between' }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickClaim}
          disabled={updating}
          fullWidth
          startIcon={<Iconify icon="ic:round-shopping-cart" />}
          sx={{
            maxWidth: { sm: 200 }, mt: 2, mb: 2, mr: 2,
            boxShadow: donation.status === DonationStatus.ACTIVE && !updating ? '0 0 0 rgba(25, 118, 210, 0.4)' : 'none',
            '&::after': donation.status === DonationStatus.ACTIVE && !updating ? {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '10%',
              animation: 'ripple 3s infinite'
            } : {}
          }}
        >
          {updating ? 'Processing...' : 'Claim'}
        </Button>

        {donation.createdBy === auth.currentUser?.uid && (
          <>

            <Button
              variant="outlined"
              color="secondary"              
              fullWidth
              disabled={duplicating}
              onClick={async () => {
                setDuplicating(true);
                const cloned = {
                  title: donation.title,
                  foodType: donation.foodType,
                  status: DonationStatus.ACTIVE,
                  photo: donation.photo,
                  weight: donation.weight,
                  expiry: donation.expiry,
                  address: donation.address,
                  contactPerson: donation.contactPerson || '',
                  contactPhone: donation.contactPhone || '',
                  notes: donation.notes || ''
                };
                const { success, message } = await duplicateDonation(cloned);
                setDuplicating(false);
                onSetSnackbar(message, success ? 'success' : 'error');
              }}
              startIcon={<Iconify icon="material-symbols:copy-all" />}
              sx={{ maxWidth: { sm: 200 }, mt: 0, mb: 2 }}
            >
              {duplicating ? 'Duplicating...' : 'Duplicate Donation'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={onOpenDeleteDialog}
              disabled={deleting}
              fullWidth
              startIcon={<Iconify icon="material-symbols:delete" />}
              sx={{ maxWidth: { sm: 200 }, mt: 0, mb: 2 }}
            >
              Delete Donation
            </Button>

          </>
        )}

      </Box>
    );
  }

  // Render claimed status buttons
  if (donation.status === DonationStatus.CLAIMED) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 2, justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmPickup}
          disabled={confirming || donation.claimedBy !== auth.currentUser?.uid}
          fullWidth
          startIcon={<Iconify icon="material-symbols:check-circle" />}
          sx={{ maxWidth: { sm: 200 }, mt: 2, mb: 2, mr: 2 }}
        >
          {confirming ? 'Processing...' : 'Confirm Pickup'}
        </Button>

        <Button
          variant="outlined"
          color="warning"
          onClick={handleUndoClaim}
          disabled={undoing || donation.claimedBy !== auth.currentUser?.uid}
          fullWidth
          startIcon={<Iconify icon="material-symbols:undo" />}
          sx={{ maxWidth: { sm: 200 }, mt: 0, mb: 2, mr: 2 }}
        >
          {undoing ? 'Processing...' : 'Undo Claim'}
        </Button>

        {donation.createdBy === auth.currentUser?.uid && (
          <Button
            variant="outlined"
            color="error"
            onClick={onOpenDeleteDialog}
            disabled={deleting || donation.status === DonationStatus.CLAIMED}
            fullWidth
            startIcon={<Iconify icon="material-symbols:delete" />}
            sx={{ maxWidth: { sm: 200 }, mt: 0, mb: 2 }}
          >
            {donation.status === DonationStatus.CLAIMED ? 'Cannot delete claimed donation' : 'Delete Donation'}
          </Button>
        )}
      </Box>
    );
  }

  // Render picked up status buttons
  if (donation.status === DonationStatus.PICKED_UP && donation.claimedBy === auth.currentUser?.uid) {
    return (
      <>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleUndoPickup}
          disabled={confirming}
          fullWidth
          startIcon={<Iconify icon="material-symbols:undo" />}
          sx={{ maxWidth: { sm: 200 }, mt: 2, mb: 2, mr: 2 }}
        >
          {confirming ? 'Processing...' : 'Undo Pickup'}
        </Button>

        {donation.createdBy === auth.currentUser?.uid && (
          <Button
            variant="outlined"
            color="error"
            onClick={onOpenDeleteDialog}
            disabled={deleting}
            fullWidth
            startIcon={<Iconify icon="material-symbols:delete" />}
            sx={{ maxWidth: { sm: 200 }, mt: 2, mb: 2 }}
          >
            Delete Donation
          </Button>
        )}
      </>
    );
  }

  // For other statuses (like EXPIRED)
  if (donation.status === DonationStatus.EXPIRED && donation.createdBy === auth.currentUser?.uid) {
    return (
      <Button
        variant="outlined"
        color="error"
        onClick={onOpenDeleteDialog}
        disabled={deleting}
        fullWidth
        startIcon={<Iconify icon="material-symbols:delete" />}
        sx={{ maxWidth: { sm: 200 }, mt: 2, mb: 2 }}
      >
        Delete Donation
      </Button>
    );
  }

  return null;
}