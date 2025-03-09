import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

import { auth, db, DBTables } from 'src/hooks/use-firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useUser } from 'src/contexts/user-context';
import { doc, getDoc } from 'firebase/firestore';
import { SignInError, SignInErrorCode } from 'src/types/auth-types';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState('aldrick@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUser();

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case SignInErrorCode.INVALID_CREDENTIAL:
      case SignInErrorCode.INVALID_PASSWORD:
        return 'Invalid email or password';
      case SignInErrorCode.INVALID_EMAIL:
        return 'Please enter a valid email address';
      case SignInErrorCode.USER_DISABLED:
        return 'This account has been disabled. Please contact support';
      case SignInErrorCode.USER_NOT_FOUND:
        return 'No account found with this email';
      case SignInErrorCode.TOO_MANY_REQUESTS:
        return 'Too many sign-in attempts. Please try again later';
      case SignInErrorCode.OPERATION_NOT_ALLOWED:
        return 'Sign-in is currently disabled. Please try again later';
      case SignInErrorCode.REQUIRES_RECENT_LOGIN:
        return 'Please sign in again to continue';
      default:
        return 'Sign-in failed. Please try again';
    }
  };

  const handleSignIn = useCallback((loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, loginEmail, loginPassword).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      if (user) {
        // Retrieve extra user info
        getDoc(doc(db, DBTables.USERS, user.uid)).then((docSnap) => {
          const userDetail = docSnap.data();
          console.log('Sign-in succeeded for user %s - %s', user.email, userDetail?.displayName);
          setIsSignedIn(true);
          setUser({
            uid: user.uid,
            displayName: userDetail?.displayName || '',
            email: user.email || '',
            organization: userDetail?.organization || '',
            role: userDetail?.role || '',
            avatar: userDetail?.avatar || '',
            isVerified: userDetail?.isVerified || false,
            status: userDetail?.status || 'Pending',
            // ... add more user fields
          });
          router.push('/');
        });
      } else {
        console.error('Sign-in failed unexpectedly');
      }
    }).catch((err: SignInError) => {
      console.error('Sign-in failed:', err);
      setError(getErrorMessage(err.code));
      setIsLoading(false);
    }).finally(() => { setIsLoading(false); });
  }, [router, setUser]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
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
        onClick={() => handleSignIn(email, password)}
      >
        {isLoading ? 'Authenticating...' : 'Sign in'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4">Sign in</Typography>
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

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
