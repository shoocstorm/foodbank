import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { useNotifications, NotificationProps } from 'src/hooks/use-firebase';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fToNow } from 'src/utils/format-time';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export default function NotificationsPage() {
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { notifications, loading, error, markAsRead, markAllAsRead, deleteNotifications } = useNotifications();


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);


    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = notifications.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    }, [notifications]);

    const handleClick = useCallback((id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    }, [selected]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);


    function TableHead({ children }: { children: React.ReactNode }) {
        return (
            <Box component="thead" sx={{ bgcolor: 'background.neutral' }}>
                {children}
            </Box>
        );
    }

    const handleDeleteSelected = useCallback(() => {
        setDeleteTarget(selected);
        setOpenDeleteDialog(true);
    }, [selected]);

    const handleDeleteSingle = useCallback((id: string) => {
        setDeleteTarget([id]);
        setOpenDeleteDialog(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (deleteTarget.length === 0) return;

        setIsDeleting(true);
        try {
            // Assuming deleteNotifications is available in useNotifications hook
            await deleteNotifications(deleteTarget);
            setSelected([]);
            setDeleteTarget([]);
        } catch (err) {
            console.error('Failed to delete notifications:', err);
        } finally {
            setIsDeleting(false);
            setOpenDeleteDialog(false);
        }
    }, [deleteTarget, deleteNotifications]);

    const handleCancelDelete = useCallback(() => {
        setDeleteTarget([]);
        setOpenDeleteDialog(false);
    }, []);


    const isSelected = useCallback((id: string) => selected.indexOf(id) !== -1, [selected]);

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading notifications: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Notifications
                </Typography>
                {selected.length > 0 && (
                    <Tooltip title="Delete selected">
                        <IconButton onClick={handleDeleteSelected}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Card>
                <Scrollbar>
                    <TableContainer>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < notifications.length}
                                            checked={notifications.length > 0 && selected.length === notifications.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>Notification</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notifications
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((notification) => {
                                        const isItemSelected = isSelected(notification.id);

                                        return (
                                            <TableRow
                                                hover
                                                key={notification.id}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        onClick={() => handleClick(notification.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ ml: 2 }}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {notification.message}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{fToNow(notification.time)}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ color: notification.status === 'unread' ? 'gray' : 'success.main', fontWeight: notification.status === 'unread' ? 'bold' : '' }}
                                                    >
                                                        {notification.status === 'unread' ? 'UNREAD' : 'READ'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        onClick={() => handleDeleteSingle(notification.id)}
                                                    >
                                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={notifications.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>


            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {`Delete ${deleteTarget.length > 1 ? 'Selected Notifications' : 'Notification'}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {`Are you sure you want to delete ${deleteTarget.length > 1 ? 'these notifications' : 'this notification'}? This action cannot be undone.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <LoadingButton
                        loading={isDeleting}
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
