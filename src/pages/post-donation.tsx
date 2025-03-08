import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, MenuItem, Snackbar, Alert, DialogTitle, DialogContent, DialogContentText, Dialog, DialogActions } from '@mui/material';
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
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    weight: '',
    expiry: '',
    address: '',
    contactPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      title: title ? '' : 'Title is required',
      weight: weight ? '' : 'Weight is required',
      expiry: expiry ? '' : 'Expiry is required',
      address: address ? '' : 'Address is required',
      contactPhone: contactPhone ? '' : 'Contact Phone is required',
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

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
      setOpenDialog(true);
      // Reset form
      setTitle('');
      setFoodType('Halal');
      setWeight('');
      setPhoto(null);
      setExpiry('');
      setAddress('');
      setContactPerson('');
      setContactPhone('');
      setNotes('');

      // Redirect after 2 seconds
      setTimeout(() => {
        setOpenDialog(false);
        navigate('/donations');
      }, 55000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to post donation. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotificationDialog = () => {
    setOpenDialog(false);
    navigate('/donations');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Post a Donation
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          select
          id="foodType"
          label="Food Type"
          name="foodType"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
        >
          <MenuItem value="Halal">Halal</MenuItem>
          <MenuItem value="Non-Halal">Non-Halal</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          id="weight"
          label="Weight (kg)"
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          error={!!errors.weight}
          helperText={errors.weight}
        />
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

        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="expiry"
          label="Expiry (hours)"
          name="expiry"
          type="number"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          error={!!errors.expiry}
          helperText={errors.expiry}

        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="Address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={!!errors.contactPhone}
          helperText={errors.contactPhone}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="contactPerson"
          label="Contact Person"
          name="contactPerson"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="contactPhone"
          label="Contact Phone Number"
          name="contactPhone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
        />
        <TextField
          margin="normal"
          fullWidth
          id="notes"
          label="Notes"
          name="notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Post Donation
        </Button>
      </Box>

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

      <Dialog
        open={openDialog}
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
