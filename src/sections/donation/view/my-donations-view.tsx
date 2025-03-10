import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Pagination } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUser } from 'src/contexts/user-context';
import { useDonations } from 'src/hooks/use-firebase';
import { Iconify } from 'src/components/iconify';

import { DonationItem } from '../donation-card-item';
import { DonationSort } from '../donation-sort';

export function MyDonationsView() {
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

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  // Empty state component
  const EmptyState = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ py: 10, textAlign: 'center' }}
    >
      <Box
        sx={{
          mb: 3,
          width: 240,
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify
          icon="solar:box-minimalistic-bold-duotone"
          width={160}
          sx={{
            color: 'primary.main',
            opacity: 0.8,
          }}
        />
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        No Donations Yet
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', mb: 4, maxWidth: 480 }}
      >
        Start sharing your surplus food with those in need.
        Your donations can help fight hunger and reduce food waste in your community.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => navigate('/post-donation')}
      >
        Post a Donation
      </Button>
    </Box>
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          My Donations
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/post-donation')}>
          New Donation
        </Button>
      </Box>

      {filteredDonations.length === 0 ? (
        <EmptyState />
      ) : (
        <>
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
        {paginatedDonations.map((donation) => (
          <Grid key={donation.id} xs={12} sm={6} md={3}>
            <DonationItem
              donation={donation}
              user={user}
              onClick={() => navigate(`/item-details/${donation.id}`)}
            />
          </Grid>
        ))}
      </Grid>


      {totalPages > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 8, mx: 'auto' }}
        />
      )}

    </>
      )}
    </DashboardContent>
  );
}