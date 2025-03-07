import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { DonationItemProps } from 'src/sections/product/donation-item';
import { _mockedDonations } from 'src/_mock';
import { useDonations } from 'src/hooks/use-firebase';

// ----------------------------------------------------------------------

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { donations } = useDonations();
  const [donation, setDonation] = useState<DonationItemProps | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (donations) {
      const fetched = donations.find((item) => item.id === id);
      if (fetched) {
        setDonation({
          id: fetched.id,
          name: fetched.title,
          coverUrl: fetched.photo || '/public/assets/images/donation/donation-1.webp',
          price: fetched.weight,
          priceSale: null,
          colors: [],
          status: fetched.status || 'active',
          address: fetched.address,
          publishedAt: fetched.creationTime,
        });
      } else {
        setDonation(null);
      }
    }
  }, [id, donations]);

  if (!donation) {
    return <p>Loading...</p>;
  }

return (
    <>
      <Helmet>
        <title> {`Item Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <div style={{ padding: '48px' }}>
        <h1>Item Details</h1>
        <p>Details for item with ID: {id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <img src={donation.coverUrl} alt={donation.name} style={{ width: '300px', height: '300px', borderRadius: '8px' }} />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Confirm Pickup
          </Button>
        </div>
        <p><span style={{ color: 'gray' }}>Name:</span> {donation.name}</p>
        <p><span style={{ color: 'gray' }}>Address:</span> {donation.address}</p>
        <p><span style={{ color: 'gray' }}>Published At:</span> {donation.publishedAt}</p>
        <p><span style={{ color: 'gray' }}>Price:</span> {donation.price}</p>
        <p><span style={{ color: 'gray' }}>Status:</span> {donation.status}</p>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Pickup Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your pickup is confirmed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  </>
  );
}
