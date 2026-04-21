import React, { useEffect, useState } from 'react'
import { Box, Paper, TextField, debounce, Checkbox, FormControlLabel } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { useAlert } from '../../hooks/useAlert';
import { getDoctors } from '../../providers/list';

const DoctorListPopup = ({ loadList, setLoadList, id, actions, setActions }) => {
    const { showAlert } = useAlert();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const isDoctorChecked = (doctor) => {
        const matches = doctor.doctor_services.some((ds) => ds.service_id === id);

        if (actions.selected.includes(doctor.id)) return true;
        if (actions.unselected.includes(doctor.id)) return false;
        return matches;
    };

    const columns = [
        { flex: 1, field: 'fullname', headerName: 'Full name', renderCell: (params) => {
            return <span className="capitalize">{params.row.lastname}, {params.row.firstname}</span>;
        }},
        { flex: 1, field: 'description', headerName: 'Description' },
        { flex: 1, field: 'is_active', headerName: 'Status', renderCell: (params) => params.row.is_active ? 'Yes' : 'No' },
        { flex: 1, field: 'actions', headerName: 'Actions', renderCell: (params) => {
            return (
                <Checkbox
                    key={params.row.id + search}
                    checked={isDoctorChecked(params.row)}
                    onChange={(value) => handleCheckboxChange(params.row.id, value.target.checked)}
                />
            );
        }},
    ];

    const handleCheckboxChange = (doctorId, isChecked) => {
        if (isChecked) {
            setActions((v) => {
                const newSelected = [...new Set([...v.selected, doctorId])];
                const newUnselected = v.unselected.filter(id => id !== doctorId);
                return {...v, selected: newSelected, unselected: newUnselected}
            })
        } else {
            setActions((v) => {
                const newUnselected = [...new Set([...v.unselected, doctorId])];
                const newSelected = v.selected.filter(id => id !== doctorId);
                return {...v, selected: newSelected, unselected: newUnselected}
            })
        }
    }

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setDoctors([]);
                const response = await getDoctors({ 
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    search
                });
                setDoctors(response.data.data.items || []);
                setTotalItem(response.data.data.total_item || 0);
                setLoadList(false);
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();       
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
    const currentPageIds = doctors.map((doctor) => doctor.id);
    const selectedOnPageCount = doctors.filter(isDoctorChecked).length;
    const allOnPageSelected = doctors.length > 0 && selectedOnPageCount === doctors.length;
    const someOnPageSelected = selectedOnPageCount > 0 && selectedOnPageCount < doctors.length;

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
                                        unselected: v.unselected.filter((doctorId) => !currentPageIds.includes(doctorId)),
                                    }));
                                } else {
                                    setActions((v) => ({
                                        ...v,
                                        selected: v.selected.filter((doctorId) => !currentPageIds.includes(doctorId)),
                                        unselected: [...new Set([...v.unselected, ...currentPageIds])],
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
                    rows={doctors}
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

export default DoctorListPopup;
