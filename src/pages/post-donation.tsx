import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, MenuItem, Snackbar, Alert, DialogTitle, DialogContent, DialogContentText, Dialog, DialogActions, Grid } from '@mui/material';
import { useUser } from 'src/contexts/user-context';
import { DonationStatus } from 'src/types/donation-types';
import { Iconify } from 'src/components/iconify';

import { useAddDonation } from '../hooks/use-firebase';

const PostDonation = () => {
  const { user } = useUser();

  const navigate = useNavigate();
  const { addDonation } = useAddDonation();
  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('Halal');
  const [weight, setWeight] = useState('0.5');
  const [photo, setPhoto] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('12');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openSuccessDialog, setOpenSucessDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    weight: '',
    expiry: '',
    address: '',
    contactPhone: '',
  });

  const handlePreview = (e: any) => {
    e.preventDefault();
    const newErrors = {
      title: title ? '' : 'Title is required',
      weight: weight ? '' : 'Weight is required',
      expiry: expiry ? '' : 'Expiry is required',
      address: address ? '' : 'Pickup Address is required',
      contactPhone: contactPhone ? '' : 'Contact Phone is required',
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

    setOpenPreviewDialog(true);
  };

  const handleSubmit = async () => {
    const donation = {
      title,
      foodType,
      weight: parseFloat(weight),
      photo,
      expiry: parseInt(expiry, 10),
      address,
      contactPerson,
      contactPhone,
      notes,
      status: DonationStatus.ACTIVE,
      createdBy: user?.uid,
      creationTime: new Date().getTime(),
    };

    try {
      await addDonation(donation);
      setOpenPreviewDialog(false);
      setOpenSucessDialog(true);
      // Reset form
      setTitle('');
      setFoodType('Halal');
      setWeight('0.5');
      setPhoto(null);
      setExpiry('12');
      setAddress('');
      setContactPerson('');
      setContactPhone('');
      setNotes('');

      // Redirect after 2 seconds
      setTimeout(() => {
        setOpenSucessDialog(false);
        navigate('/donations');
      }, 5000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to post donation. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotificationDialog = () => {
    setOpenSucessDialog(false);
    navigate('/donations');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: 'primary.main',
            fontWeight: 600,
            mb: 3
          }}
        >
          Share Your Food with the Community
        </Typography>

        {/* Details of the donation form */}
        <Box component="form" onSubmit={handleSubmit} >
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            placeholder="E.g., Fresh vegetables from local market, Cooked rice from restaurant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            error={!!errors.title}
            helperText={errors.title}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Food Type
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2
              }}
            >
              <Button
                fullWidth
                variant={foodType === 'Halal' ? 'contained' : 'outlined'}
                onClick={() => setFoodType('Halal')}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: foodType === 'Halal' ? 'primary.main' : 'divider'
                }}
              >
                <Iconify icon="mdi:food-halal" sx={{ mr: 1 }} />
                Halal
              </Button>
              <Button
                fullWidth
                variant={foodType === 'Non-Halal' ? 'contained' : 'outlined'}
                onClick={() => setFoodType('Non-Halal')}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: foodType === 'Non-Halal' ? 'primary.main' : 'divider'
                }}
              >
                <Iconify icon="mdi:food" sx={{ mr: 1 }} />
                Non-Halal
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="weight"
                label="Weight (kg)"
                name="weight"
                type="number"
                placeholder="Approximate weight in kilograms (e.g., 0.5 for 500g)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                error={!!errors.weight}
                helperText={errors.weight}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="expiry"
                label="Expiry (in hours)"
                placeholder="How many hours until the food should be consumed? (e.g., 12 for cooked food, 24-48 for fresh produce)"
                name="expiry"
                type="number"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                error={!!errors.expiry}
                helperText={errors.expiry}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
          </Grid>

          <TextField
            margin="normal"
            fullWidth
            id="photo"
            label="Photo"
            name="photo"
            type="file"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setPhoto(target.files && target.files.length > 0 ? target.files[0] : null);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Pickup Address"
            name="address"
            placeholder="Full pickup address including unit number and postal code"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="contactPerson"
                label="Contact Person"
                name="contactPerson"
                placeholder="Name of person to contact for pickup"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="contactPhone"
                label="Contact Phone"
                name="contactPhone"
                placeholder="Phone number for pickup coordination"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
          </Grid>

          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Notes"
            name="notes"
            multiline
            rows={4}
            placeholder="Include any food handling tips or requirements here for recipient to note, e.g: any special storage or reheating instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />


          {/* Preview button */}
          <Button
            type="button"
            onClick={handlePreview}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <Iconify icon="mdi:heart" sx={{ mr: 1 }} />
            Share Your Donation
          </Button>

        </Box>

        {/* Preview dialog */}
        <Dialog
          open={openPreviewDialog}
          onClose={() => setOpenPreviewDialog(false)}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              maxHeight: { xs: '100%', sm: '90vh' },
              height: { xs: '100%', sm: 'auto' }
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {/* Header with background */}
            <Box
              sx={{
                p: 4,
                pb: 2,
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }} />

              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="mdi:food-apple" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Preview Your Donation
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500 }}>
                    Please review your donation details below before sharing with the community.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 }, overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' } }}>
              <Grid container spacing={3}>
                {/* Left column */}
                <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{
                    p: { xs: 2, sm: 2.5 },
                    mb: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Iconify icon="mdi:food" sx={{ color: 'primary.main', fontSize: 24, mr: 1.5 }} />
                      <Typography variant="h6">Food Information</Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Title
                      </Typography>
                      <Typography variant="body1" fontWeight="500">{title}</Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Food Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                          icon={foodType === 'Halal' ? "mdi:food-halal" : "mdi:food"}
                          sx={{ color: foodType === 'Halal' ? 'success.main' : 'info.main', mr: 1 }}
                        />
                        <Typography variant="body1" fontWeight="500">{foodType}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Weight
                      </Typography>
                      <Typography variant="body1" fontWeight="500">{weight} kg</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Expiry Time
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="mdi:clock-outline" sx={{ color: parseInt(expiry, 2) < 24 ? 'warning.main' : 'success.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="500">{expiry} hours</Typography>
                      </Box>
                    </Box>
                  </Box>

                </Grid>

                {/* Right column */}
                <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    mb: { xs: 2, sm: 3 },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Iconify icon="mdi:map-marker" sx={{ color: 'error.main', fontSize: 24, mr: 1.5 }} />
                      <Typography variant="h6">Pickup Information</Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">{address}</Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Contact Person
                      </Typography>
                      <Typography variant="body1" fontWeight="500">{contactPerson}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Contact Phone
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="mdi:phone" sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="500">{contactPhone}</Typography>
                      </Box>
                    </Box>
                  </Box>

                </Grid>

                {/* Additional Notes */}
                <Grid item xs={12} sm={12} md={12}>
                  {notes && (
                    <Box sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      bgcolor: 'rgba(245, 245, 245, 0.8)',
                      border: '1px dashed rgba(0, 0, 0, 0.1)',                      
                      mb: { xs: 2, sm: 3 },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Iconify icon="mdi:note-text-outline" sx={{ color: 'text.secondary', fontSize: 22, mr: 1.5 }} />
                        <Typography variant="h6">Additional Notes</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {notes}
                      </Typography>
                    </Box>

                  )}
                </Grid>

                {/* Prompt for next step */}
                <Grid item xs={12} sm={12} md={12}>

                  <Box sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 2,
                    bgcolor: 'rgba(230, 244, 234, 0.8)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    mb: { xs: 2, sm: 0 },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Iconify icon="mdi:information-outline" sx={{ color: 'success.main', fontSize: 24, mr: 1.5 }} />
                      <Typography variant="h6">What happens next?</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      After publishing, your donation will be visible to people in need. You will be notified when someone claims your donation.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thank you for helping reduce food waste and supporting your community!
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 3,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              bgcolor: 'background.paper',
              position: 'sticky',
              bottom: 0,
              zIndex: 1,
              width: '100%',

            }}>
              <Button
                onClick={() => setOpenPreviewDialog(false)}
                variant="outlined"
                startIcon={<Iconify icon="mdi:arrow-left" />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  textTransform: 'none',
                  bgcolor: 'background.paper',
                }}
              >
                Back to Edit
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<Iconify icon="mdi:check-circle" />}
                sx={{
                  borderRadius: 2,
                  ml: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)',
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark',
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.35)',
                  }
                }}
              >
                Publish Now
              </Button>
            </Box>
          </Box>
        </Dialog>


      </Box>

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

      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseNotificationDialog}
        aria-labelledby="thank-you-dialog-title"
        aria-describedby="thank-you-dialog-description"
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
          <DialogTitle id="thank-you-dialog-title" sx={{ pb: 1 }}>
            Thank You for Your Generous Donation!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="thank-you-dialog-description" sx={{ textAlign: 'center', mb: 3 }}>
              Your contribution makes a real difference in our community. Together, we’re reducing food waste and helping those in need.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ mt: 3 }}>
            <Button
              onClick={handleCloseNotificationDialog}
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
    </Container>
  );
};

export default PostDonation;
