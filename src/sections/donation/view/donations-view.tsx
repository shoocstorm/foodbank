import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { _mockedDonations } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';
import { useDonations } from 'src/hooks/use-firebase';
import { useUser } from 'src/contexts/user-context';

import { DonationItem } from '../donation-item';
import { DonationSort } from '../donation-sort';
import { CartIcon } from '../donation-cart-widget';
import { DonationFilters } from '../donation-filters';
import type { FiltersProps } from '../donation-filters';


// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'Perishable', label: 'Perishable' },
  { value: 'Canned', label: 'Canned' }
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Halal', label: 'Halal' },
  { value: 'Non-Halal', label: 'Non-Halal' }
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: '< 1KM' },
  { value: 'between', label: 'Between 1KM - 3KM' },
  { value: 'above', label: '> 3KM' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

export function DonationsView() {
  const { donations } = useDonations();
  const { user } = useUser();

  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  // Calculate pagination
  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedDonations = donations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Donations
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
          <DonationFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              genders: GENDER_OPTIONS,
              categories: CATEGORY_OPTIONS,
              ratings: RATING_OPTIONS,
              price: PRICE_OPTIONS,
              colors: COLOR_OPTIONS,
            }}
          />

          <DonationSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {paginatedDonations.map((donation) => (
          <Grid key={donation.id} xs={12} sm={6} md={3}>
            <DonationItem donation={donation} user={user} onClick={() => navigate(`/item-details/${donation.id}`)} />
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

    </DashboardContent>
  );
}
