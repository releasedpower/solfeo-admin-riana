import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { activateUser, deactivateUser, getUser, deleteUser } from 'services/user-service';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('username');
  const [orderType, setOrderType] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nbPage, setNbPage] = useState(1);
  const [refreshSearch, setRefreshSearch] = useState(true);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const data = await getUser(10, currentPage, keyword, statusFilter, orderBy, orderType);
      if (data) {
        setCurrentPage(data.result.pagination.currentPage);
        setNbPage(data.result.pagination.numberOfPages);
        setUsers(data.result.result);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [currentPage, refreshSearch]);

  const handleDialogOpen = (user, type) => {
    setSelectedUser(user);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleConfirmAction = async () => {
    if (dialogType === 'activate') {
      const result = await activateUser(selectedUser.id);
      if (result) {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, status: 100 } : user)));
      }
    } else if (dialogType === 'deactivate') {
      const result = await deactivateUser(selectedUser.id);
      if (result) {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, status: 0 } : user)));
      }
    } else if (dialogType === 'delete') {
      const result = await deleteUser(selectedUser.id);
      if (result) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
      }
    }
    handleDialogClose();
  };

  const handleSearch = () => {
    setRefreshSearch(!refreshSearch);
    setCurrentPage(1);
  };

  return (
    <MainCard title="">
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField label="Pseudo" variant="outlined" fullWidth value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="activate">Activé</MenuItem>
                <MenuItem value="deactivate">Désactivé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Ordonné par</InputLabel>
              <Select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} label="Order By">
                <MenuItem value="username">Pseudo</MenuItem>
                <MenuItem value="created_at">Inscription</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Sens</InputLabel>
              <Select value={orderType} onChange={(e) => setOrderType(e.target.value)} label="Type Order">
                <MenuItem value="asc">Croissant</MenuItem>
                <MenuItem value="desc">Décroissant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
              Rechercher
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pseudo</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Inscription</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip label={user.status === 100 ? 'Activé' : 'Désactivé'} color={user.status === 100 ? 'success' : 'error'} />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')} {new Date(user.createdAt).toLocaleTimeString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {user.status === 100 ? (
                        <Button variant="contained" color="primary" onClick={() => handleDialogOpen(user, 'deactivate')}>
                          Désactiver
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={() => handleDialogOpen(user, 'activate')}>
                          Activer
                        </Button>
                      )}
                      <Button variant="contained" color="secondary" onClick={() => handleDialogOpen(user, 'delete')}>
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination count={nbPage} page={currentPage} color="primary" onChange={handleChangePage} />
        </>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === 'activate'
            ? 'Activer cet utilisateur '
            : dialogType === 'deactivate'
              ? 'Désactiver cet utilisateur'
              : 'Supprimer cet utilisateur'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'activate'
              ? `Êtes-vous sûr d'activer cet utilisateur ${selectedUser?.username}?`
              : dialogType === 'deactivate'
                ? `Êtes-vous sûr de désactiver cet utilisateur ${selectedUser?.username}?`
                : `Êtes-vous sûr de supprimer cet utilisateur ${selectedUser?.username}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={handleConfirmAction} color="primary">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UserList;
