import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Snackbar, Alert , Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import type { DonationItemProps } from 'src/sections/donation/donation-item';
import { _mockedDonations } from 'src/_mock';
import { useDonations, useUpdateDonationStatus } from 'src/hooks/use-firebase';

// ----------------------------------------------------------------------

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { donations } = useDonations();
  const { updateStatus } = useUpdateDonationStatus();
  const [donation, setDonation] = useState<DonationItemProps | null>(null);
  const [isNotificationDialogOpen, setOpenNotificationDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '', severity: 'success' });

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
        fetched.photo = fetched.photo || '/public/assets/images/donation/donation-1.webp';
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

      <div style={{ padding: '48px' }}>
        <h1>Item Details</h1>
        <p>Details for item with ID: {id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <img src={donation.photo} alt={donation.title} style={{ width: '300px', height: '300px', borderRadius: '8px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleClickClaim}
              disabled={updating || donation.status === 'CLAIMED'}
            >
              {updating ? 'Processing...' : donation.status === 'CLAIMED' ? 'Already Claimed' : 'Confirm Pickup'}
            </Button>
            {donation.status === 'CLAIMED' && (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleUndoClaim}
                disabled={undoing}
              >
                {undoing ? 'Processing...' : 'Undo Claim'}
              </Button>
            )}
          </div>
        </div>
        <p><span style={{ color: 'gray' }}>Title:</span> {donation.title}</p>
        <p><span style={{ color: 'gray' }}>Status:</span> {donation.status}</p>
        <p><span style={{ color: 'gray' }}>Address:</span> {donation.address}</p>
        <p><span style={{ color: 'gray' }}>Published At:</span> {donation.creationTime}</p>
        <p><span style={{ color: 'gray' }}>Weight:</span> {donation.weight} (kg)</p>
        <p><span style={{ color: 'gray' }}>Expiry:</span> {donation.expiry} (h)</p>
        {donation.status === 'CLAIMED' && (
          <p><span style={{ color: 'gray' }}>Collection Code:</span> <b>{donation.collectionCode}</b></p>
        )}
        
      </div>
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


