import React, { useState } from 'react'
import ProtectedRoute from '../../routes/ProtectedRoute'
import { LoadListProvider } from '../../contexts/LoadListContext';
import UserList from '../../components/tables/UserList';
import { Box } from '@mui/material';

const UserPage = () => {
  const [loadList, setLoadList] = useState(false);
  return (
    <LoadListProvider>
      <Box className="flex flex-col gap-4">
        <UserList loadList={loadList} setLoadList={setLoadList} />
      </Box>
    </LoadListProvider>
  );
}

const ProtectedUserPage = ProtectedRoute(UserPage);
export default ProtectedUserPage