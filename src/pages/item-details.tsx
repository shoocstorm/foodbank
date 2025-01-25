import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { ProductItemProps } from 'src/sections/product/product-item';
import { _products } from 'src/_mock';

// ----------------------------------------------------------------------

export default function ItemDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductItemProps | null>(null);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

useEffect(() => {
    const fetchedProduct = _products.find((item) => item.id === id);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      setProduct(null);
    }
  }, [id]);

  if (!product) {
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
          <img src={product.coverUrl} alt={product.name} style={{ width: '300px', height: '300px', borderRadius: '8px' }} />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Confirm Pickup
          </Button>
        </div>
        <p><span style={{ color: 'gray' }}>Name:</span> {product.name}</p>
        <p><span style={{ color: 'gray' }}>Address:</span> {product.address}</p>
        <p><span style={{ color: 'gray' }}>Published At:</span> {product.publishedAt}</p>
        <p><span style={{ color: 'gray' }}>Price:</span> {product.price}</p>
        <p><span style={{ color: 'gray' }}>Status:</span> {product.status}</p>
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
