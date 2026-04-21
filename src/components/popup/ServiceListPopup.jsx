import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Button, TextField, debounce, Checkbox, FormControlLabel } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { useAlert } from '../../hooks/useAlert';
import { getServices } from '../../providers/list';

const ServiceListPopup = ({ loadList, setLoadList, id, actions, setActions }) => {
    const { showAlert } = useAlert();   
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const isServiceChecked = (service) => {
        const matches = service.doctor_services.some((ds) => ds.doctor_id === id);

        if (actions.selected.includes(service.id)) return true;
        if (actions.unselected.includes(service.id)) return false;
        return matches;
    };

    const columns = [
        { flex: 1, field: 'name', headerName: 'Name' },
        { flex: 1, field: 'description', headerName: 'Description' },
        { flex: 1, field: 'is_active', headerName: 'Status', renderCell: (params) => params.row.is_active ? 'Yes' : 'No' },
        { flex: 1, field: 'actions', headerName: 'Actions', renderCell: (params) => {
            return (
                <Checkbox
                    key={params.row.id + search}
                    checked={isServiceChecked(params.row)}
                    onChange={(value) => handleCheckboxChange(params.row.id, value.target.checked)}
                />
            );
        }},
    ];

    const handleCheckboxChange = (serviceId, isChecked) => {
        if (isChecked) {
            setActions((v) => {
                const newSelected = [...new Set([...v.selected, serviceId])];
                const newUnselected = v.unselected.filter(id => id !== serviceId);
                return {...v, selected: newSelected, unselected: newUnselected}
            })
        } else {
            setActions((v) => {
                const newUnselected = [...new Set([...v.unselected, serviceId])];
                const newSelected = v.selected.filter(id => id !== serviceId);
                return {...v, selected: newSelected, unselected: newUnselected}
            })
        }
    }

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                setServices([]);
                const response = await getServices({ 
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    search
                });
                setServices(response.data.data.items || []);
                setTotalItem(response.data.data.total_item || 0);
                setLoadList(false);
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();       
    }, [paginationModel.page, paginationModel.pageSize, loadList, search]);

    useEffect(() => {
        setActions({
            selected: [],
            unselected: [],
        });
    }, [paginationModel.page, search]);

    const handleSearch = debounce((e) => {
        setSearch(e.target.value);
    }, 500);
    const currentPageIds = services.map(service => service.id);
    const selectedOnPageCount = services.filter(isServiceChecked).length;
    const allOnPageSelected = services.length > 0 && selectedOnPageCount === services.length;
    const someOnPageSelected = selectedOnPageCount > 0 && selectedOnPageCount < services.length;

    return (
        <>
            <Box className="mb-2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField label="Search" variant="outlined" onChange={handleSearch} size="small" />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allOnPageSelected}
                            indeterminate={someOnPageSelected}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                    setActions((v) => ({
                                        ...v,
                                        selected: [...new Set([...v.selected, ...currentPageIds])],
                                        unselected: v.unselected.filter(id => !currentPageIds.includes(id))
                                    }));
                                } else {
                                    setActions((v) => ({
                                        ...v,
                                        selected: v.selected.filter(id => !currentPageIds.includes(id)),
                                        unselected: [...new Set([...v.unselected, ...currentPageIds])]
                                    }));
                                }
                            }}
                        />
                    }
                    label="Select All"
                />
            </Box>
            <Paper sx={{ width: '100%' }}>
                <DataGrid
                    disableColumnSorting
                    disableColumnMenu
                    rows={services}
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

export default ServiceListPopup
