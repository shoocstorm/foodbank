import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Snackbar } from '@mui/material';
import './sign-up.css';
import { useSignup } from '../hooks/use-firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { signUp } = useSignup();

  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { displayName: '', email: '', password: '' };

    if (!displayName) {
      newErrors.displayName = 'Display Name is required';
      valid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
      valid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!validate()) return;
    signUp({
      email,
      password,
      displayName,
      organization,
    }).then(() => {
      /* alert('Sign up successful! Redirecting to sign-in page...'); */
      setOpenSnackbar(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);

    }).catch((error) => {
      console.error('Sign up failed:', error);
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="displayName"
          label="Display Name"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
          error={!!errors.displayName}
          helperText={errors.displayName}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="organization"
          label="Organization"
          name="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </Typography>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message="Sign up successfully! Let's Donate, Connect, and Feed Your Community."
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
};

export default SignUp;
