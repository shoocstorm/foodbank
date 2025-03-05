import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { useUser } from 'src/contexts/user-context';

// ----------------------------------------------------------------------

export function ProfileView() {
  const theme = useTheme();
  const { user } = useUser();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Profile
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
            }}
          >
            <Avatar
              alt={user?.displayName || 'User'}
              src="/assets/images/avatar/avatar_1.jpg"
              sx={{ width: 80, height: 80 }}
            />

            <Stack spacing={1} flex={1}>
              <Typography variant="h4">{user?.displayName || 'User'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Information
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Email
                </Typography>
                <Typography>{user?.email || 'user@example.com'}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Display Name
                </Typography>
                <Typography>{user?.displayName || 'User'}</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}