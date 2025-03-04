import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { auth } from 'src/hooks/use-firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useUser } from 'src/contexts/user-context';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();  
  const [email, setEmail] = useState('abc@abc.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();

  const handleSignIn = useCallback((loginEmail: string, loginPassword: string) => {

    setIsLoading(true);
    signInWithEmailAndPassword(auth, loginEmail, loginPassword).then((userCredential) => {  
      // Signed in 
      const user = userCredential.user;
      if (user) {
        setIsSignedIn(true);
        setUser({
          displayName: user.displayName || '',
          email: user.email || '',
        });
        router.push('/');
      } else {
        console.error('Sign-in failed');
      }
    }).catch((error) => { 
      console.error('Sign-in failed'.concat(error));
      setIsLoading(false);
    }).finally(() => {  setIsLoading(false); });
    
  }, [router, setUser]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue="hello@gmail.com"
        value={email}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth        
        name="password"
        label="Password"
        defaultValue="@demo1234"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isLoading || !email || !password} 
        onClick={ () => handleSignIn(email, password)}
      >
       {isLoading? 'Authenticating...' : 'Sign in'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} to="/sign-up">
            Get started
          </Link>
        </Typography>
      </Box>

      {isSignedIn && <Typography variant="body2" color="text.secondary">Signed in successfully</Typography>}

      {!isSignedIn && renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
