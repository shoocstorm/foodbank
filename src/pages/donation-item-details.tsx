import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';

import { DonationStatus, type DonationItemProps } from 'src/types/donation-types';
import { useDonations, useDeleteDonation } from 'src/hooks/use-firebase';
import { Label } from 'src/components/label';

import { DonationStatusMilestone } from 'src/sections/post-donation/donation-item-status-milestone';
import { DonationItemDetailsSection } from 'src/sections/post-donation/donation-item-details-section';
import { DonationActions } from 'src/sections/post-donation/donation-item-action-buttons';
import { DonationNotificationDialog } from 'src/sections/post-donation/donation-item-notification-dialog';
import { DonationDeleteDialog } from 'src/sections/post-donation/donation-item-delete-dialog';
// ----------------------------------------------------------------------

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { donations } = useDonations();
  const [donation, setDonation] = useState<DonationItemProps | null>(null);
  const [isNotificationDialogOpen, setOpenNotificationDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '', severity: 'success' });
  const { deleteDonation } = useDeleteDonation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Handle snackbar messages
  const handleSetSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle donation deletion
  const handleDeleteDonation = async () => {
    setDeleting(true);
    try {
      await deleteDonation(donation!.id);
      handleSetSnackbar('Donation deleted successfully.', 'success');
      setTimeout(() => {
        navigate('/donations');
      }, 1500);
    } catch (error) {
      handleSetSnackbar('Failed to delete donation. Please try again.', 'error');
      setDeleting(false);
    }
    setDeleteDialogOpen(false);
  };

  // Refresh donation data after status change
  const handleStatusChange = () => {
    if (donations) {
      const updated = donations.find((item) => item.id === id);
      if (updated) {
        updated.photo = updated.photo || '/assets/images/food-placeholder.png';
        setDonation(updated);
      }
    }
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
  }, [id, donations, donation]);

  if (!donation) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1, mb: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
        
        <Grid container spacing={3}>
          {/* Skeleton for image */}
          <Grid xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                borderRadius: 2,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </Grid>

          {/* Skeleton for details */}
          <Grid xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ width: '60%', height: 32, bgcolor: 'grey.200', borderRadius: 1, mb: 2, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <Box sx={{ width: '40%', height: 20, bgcolor: 'grey.200', borderRadius: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
            </Box>

            <Box sx={{ mb: 4 }}>
              {[...Array(4)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    height: 24,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    mb: 2,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {[...Array(2)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 120,
                    height: 40,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.4; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title> {`Donation Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* Donation Status Milestone Diagram */}
        <DonationStatusMilestone donation={donation} />

        {/* Donation Title */}
        <Typography variant="h4" gutterBottom>{donation.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
            {/* Donation Details */}
            <DonationItemDetailsSection donation={donation} />
            
            {/* Donation Actions */}
            <DonationActions
              donation={donation}
              onStatusChange={handleStatusChange}
              onOpenDeleteDialog={() => setDeleteDialogOpen(true)}
              onOpenNotificationDialog={() => setOpenNotificationDialog(true)}
              onSetSnackbar={handleSetSnackbar}
            />

            {/* Delete Confirmation Dialog */}
            <DonationDeleteDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onDelete={handleDeleteDonation}
              deleting={deleting}
            />
          </Grid>

        </Grid>
      </Box>

      {/* Successful Claim Dialog */}
      <DonationNotificationDialog 
        open={isNotificationDialogOpen} 
        onClose={() => setOpenNotificationDialog(false)}
        donation={donation}
      />

      {/* Snackbar for displaying action result msg */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


