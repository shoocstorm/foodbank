import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { usePostDonation } from '../hooks/use-firebase';

const PostDonation = () => {
  const { addDonation } = usePostDonation();
  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('Halal');
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhoneNumber, setContactPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const donation = {
      title,
      foodType,
      weight: parseFloat(weight),
      photo,
      expiry: parseInt(expiry, 10),
      address,
      contactPerson,
      contactPhoneNumber,
      notes,
    };
    await addDonation(donation);
    // Reset form
    setTitle('');
    setFoodType('Halal');
    setWeight('');
    setPhoto(null);
    setExpiry('');
    setAddress('');
    setContactPerson('');
    setContactPhoneNumber('');
    setNotes('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Post a Donation
      </Typography>
      <Box component="form" onSubmit={(e) => handleSubmit(e)} noValidate sx={{ mt: 1 }}>
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
          id="contactPhoneNumber"
          label="Contact Phone Number"
          name="contactPhoneNumber"
          value={contactPhoneNumber}
          onChange={(e) => setContactPhoneNumber(e.target.value)}
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
    </Container>
  );
};

export default PostDonation;
