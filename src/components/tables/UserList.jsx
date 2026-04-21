import React, { useContext, useEffect, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { useAlert } from '../../hooks/useAlert';
import { getUsers } from '../../providers/list';
import { LoadListContext } from '../../contexts/LoadListContext';
import ToolbarFilter from '../ToolbarFilter';
import { getDate } from '../../utils/util.helper';
import Switch from '@mui/material/Switch';
import { updateBHWStatus } from '../../providers/create';


const UserList = ({ loadList, setLoadList }) => {
    const { loadList: editLoadList, setLoadList: editSetLoadList } = useContext(LoadListContext);
    const { showAlert } = useAlert();
    
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const dropDownOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Barangay', value: 'barangay' },
    ];

    const columns = [
        {
            flex: 1,
            field: 'name',
            headerName: 'Full name',
            sortable: false,
            renderCell: (params) => {
                return <Typography variant="body2" className="capitalize">{params.row.lastname}, {params.row.firstname}</Typography>;
            },
        },
        { flex: 1, field: 'address', headerName: 'Address', renderCell: (params) => {
            const address = params.row.address;
            if (!address || (!address.address_line && !address.barangay && !address.city && !address.province && !address.postal_code)) return <span className="text-red-500 capitalize">No address</span>;
            return <Typography variant="body2" className="capitalize">{`${address.address_line} ${address.barangay}, ${address.city}, ${address.province} ${address.postal_code}`}</Typography>;
        }},
        { flex: 1, field: 'last_login', headerName: 'Last login', renderCell: (params) => (
            <Typography variant="body2" className="capitalize">{params.row.last_login_at ? getDate(params.row.last_login_at) : '—'}</Typography>
        )},
        {flex: 1, field: 'is_bhw', headerName: 'Assign as Barangay Health Worker', renderCell: (params) => params.row.role !== 'admin' && (
            <Typography variant="body2">
                <Switch
                    checked={params.row.is_bhw}
                    onChange={(event) => handleBHWStatusChange(params.row.id, event.target.checked)}
                    inputProps={{ 'aria-label': 'BHW toggle' }}
                />
            </Typography>
        )}
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await getUsers({ 
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    search,
                });
                setUsers(response.data.data.items || []);
                setTotalItem(response.data.data.total_item || 0);
                setLoadList(false);
                editSetLoadList(false);
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoading(false);
                editSetLoadList(false);
            }
        };

        fetchDoctors();       
    }, [paginationModel.page, paginationModel.pageSize, loadList, editLoadList, search]);

    const handleSearch = (query, field) => {
        if (query && field) {
            setSearch(`${field}::${query}`)
        } else {
            setSearch('');
        }
    }

    const handleBHWStatusChange = async (userId, isBHW) => {
        try {
            await updateBHWStatus(userId, isBHW);
            setLoadList(true);
            editSetLoadList(true);
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    return (
        <>
            <Box>
                <Typography variant="h6">
                    Users
                </Typography>
            </Box>
            <ToolbarFilter onSearch={handleSearch} dropDownOptions={dropDownOptions} showDateRange={false} />
            <Paper sx={{ width: '100%' }}>
                <DataGrid
                    disableColumnSorting
                    disableColumnMenu
                    rows={users}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10]}
                    sx={{ 
                        border: 0,
                        '& .MuiDataGrid-cell': {
                            padding: '8px 16px',
                            whiteSpace: 'normal',
                            lineHeight: '1.5'
                        }
                    }}
                    loading={loading}
                    paginationMode="server"
                    rowCount={totalItem}
                    disableRowSelectionOnClick
                />
            </Paper>
        </>
    )
}

export default UserList