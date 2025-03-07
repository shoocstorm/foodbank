import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, MenuItem, Snackbar } from '@mui/material';
import { useUser } from 'src/contexts/user-context';
import { DonationStatus } from 'src/types/donation-types';

import { usePostDonation } from '../hooks/use-firebase';

const PostDonation = () => {
  const { user } = useUser();

  const navigate = useNavigate();
  const { addDonation } = usePostDonation();
  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('Halal');
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      setOpenSnackbar(true);
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
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error posting donation:', error);
    }
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
        open={openSnackbar}
        autoHideDuration={2000}
        message="Donation posted successfully!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
};

export default PostDonation;
