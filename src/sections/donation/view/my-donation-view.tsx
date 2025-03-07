import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUser } from 'src/contexts/user-context';
import { useDonations } from 'src/hooks/use-firebase';
import { Iconify } from 'src/components/iconify';

import { DonationItem } from '../../product/donation-item';
import { DonationSort } from '../../product/donation-sort';

export function MyDonationView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { donations } = useDonations();
  const [sortBy, setSortBy] = useState('newest');

  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);

  useEffect(() => {
    if (user && donations) {
      // Filter donations by current user
      const userDonations = donations.filter((donation) => donation.createdBy === user.uid);
      
      // Sort donations based on sortBy value
      const sortedDonations = [...userDonations].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.creationTime - a.creationTime;
          case 'oldest':
            return a.creationTime - b.creationTime;
          case 'expiryAsc':
            return a.expiry - b.expiry;
          case 'expiryDesc':
            return b.expiry - a.expiry;
          default:
            return 0;
        }
      });

      setFilteredDonations(sortedDonations);
    }
  }, [donations, sortBy, user]);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          My Donations
        </Typography>
                  
        <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/post-donation')}>
            New Donation
          </Button>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
          <DonationSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'expiryAsc', label: 'Expiry: Ascending' },
              { value: 'expiryDesc', label: 'Expiry: Descending' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredDonations.map((donation) => (
          <Grid key={donation.id} xs={12} sm={6} md={3}>
            <DonationItem
              donation={donation}
              onClick={() => navigate(`/item-details/${donation.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}