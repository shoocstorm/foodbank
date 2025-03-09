import type { BoxProps } from '@mui/material/Box';

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { bgBlur } from 'src/theme/styles';
import { useDonations } from 'src/hooks/use-firebase';
import { Iconify } from 'src/components/iconify';
import { DonationStatus } from 'src/types/donation-types';

// ----------------------------------------------------------------------

export function Searchbar({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { donations } = useDonations();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string, status: DonationStatus, createdAt: number, address: string }>>([]);

  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = donations
      ?.filter((donation) =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(({ id, title, status, createdAt, address }) => ({ id, title, status, createdAt, address })) || [];

    setSearchResults(results);
  }, [donations, searchTerm]);

  const handleResultClick = useCallback((id: string) => {
    navigate(`/item-details/${id}`);
    handleClose();
  }, [navigate, handleClose]);

  // Add debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              ...bgBlur({
                color: theme.vars.palette.background.default,
              }),
              top: 0,
              left: 0,
              zIndex: 99,
              width: '100%',
              display: 'flex',
              position: 'absolute',
              flexDirection: 'column',
              px: { xs: 3, md: 5 },
              boxShadow: theme.customShadows.z8,
              height: 'auto',
              minHeight: {
                xs: 'var(--layout-header-mobile-height)',
                md: 'var(--layout-header-desktop-height)',
              },
              ...sx,
            }}
            {...other}
          >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                }
                sx={{ fontWeight: 'fontWeightBold' }}
              />
            </Box>

            {(searchResults.length > 0 || searchTerm.trim()) && (
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <ListItem
                      key={result.id}
                      button
                      onClick={() => handleResultClick(result.id)}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <ListItemText primary={`[${result.status}] ${result.title}`} secondary={result.address} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem sx={{ color: 'text.secondary' }}>
                    <ListItemText primary="No matching donation found" />
                  </ListItem>
                )}
              </List>
            )}
          </Box>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
