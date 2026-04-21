import React, { useEffect, useState, lazy, Activity, useContext } from 'react'
import { Box, List, ListItem, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { getDoctors } from '../../providers/list';
import { useAlert } from '../../hooks/useAlert';
import ActionButtons from '../ActionButtons';
import { LoadListContext } from '../../contexts/LoadListContext';
import ToolbarFilter from '../ToolbarFilter';
import { getStatus } from '../../utils/util.helper';
import { AnnouncementColor, PrimaryColor } from '../../utils/constant';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const ServicesPopup = lazy(() => import('../popup/ServicesPopup'));
const EditDoctorPopup = lazy(() => import('../popup/EditDoctorPopup'));

const DoctorsList = ({ loadList, setLoadList }) => {
    const { loadList: editLoadList, setLoadList: editSetLoadList } = useContext(LoadListContext);
    const { showAlert } = useAlert();

    const [isAddService, setIsAddService] = useState(false);
    const [isEditDoctor, setIsEditDoctor] = useState(false);
    const [idSelected, setIdSelected] = useState(null);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const dropDownOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Service', value: 'service' },
    ];

    const columns = [
        { flex: 1, field: 'fullname', headerName: 'Full name', renderCell: (params) => {
            return <Typography className="capitalize" variant="body2">{params.row.lastname}, {params.row.firstname}</Typography>;
        }},
        { flex: 1, field: 'description', headerName: 'Description' },
        {
            flex: 1,
            field: 'doctor_services',
            headerName: 'Services',
            sortable: false,
            renderCell: (params) => {
                const services = params.row.doctor_services || [];

                if (!services.length) return <span className="text-red-500 capitalize">No services</span>;
                return (
                    <List sx={{ padding: 0 }}>
                        {services.map((service) => (
                            <ListItem key={service.service.id} sx={{ padding: '4px 0' }}>
                                <span className="capitalize">— {service.service?.name}</span>
                            </ListItem>
                        ))}
                    </List>
                );
            },
        },
        { flex: 1, field: 'is_active', headerName: 'Status', renderCell: (params) => {
                const status = getStatus(params.row);
                const sx = {
                    textTransform: 'uppercase',
                };
                const services = params.row.doctor_services || [];

                if (status === 'INACTIVE' || !services.length) {
                    sx.color = AnnouncementColor;
                } else {
                    sx.color = PrimaryColor;
                }

                return <Typography variant="body2" sx={sx} className="capitalize">{!services.length ? 'INACTIVE' : status}</Typography>;
        }},
        { flex: 1, field: 'actions', headerName: 'Actions', renderCell: (params) => (
            <ActionButtons id={params.row.id} iconOnly addText="Select services" editText="Edit" customAddIcon={<MedicalServicesIcon />} onAdd={onAddService} onEdit={onEditDoctor}/>
        )},
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await getDoctors({ 
                    page: paginationModel.page + 1, // API might be 1-indexed
                    size: paginationModel.pageSize,
                    search,
                });
                setDoctors(response.data.data.items || []);
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
    
    const onAddService = (id) => {
        setIdSelected(id);
        setIsAddService(true);
    };
    
    const onEditDoctor = (id) => {
        setIdSelected(id);
        setIsEditDoctor(true);
    }

    const handleAddServiceClose = () => {
        setIsAddService(false);
        setLoadList(true);
    };

    const handleEditDoctorClose = () => {
        setIsEditDoctor(false);
    }

    const handleSearch = (query, field) => {
        if (query && field) {
            setSearch(`${field}::${query}`)
        } else {
            setSearch('');
        }
    }

    return (
        <>
            <ToolbarFilter onSearch={handleSearch} dropDownOptions={dropDownOptions} showDateRange={false} />
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
            <Activity mode={isAddService ? "visible" : "hidden"}>
                <ServicesPopup open={isAddService} handleClose={handleAddServiceClose} id={idSelected}/>
            </Activity>
            <Activity mode={isEditDoctor ? "visible" : "hidden"}>
                <EditDoctorPopup open={isEditDoctor} handleClose={handleEditDoctorClose} id={idSelected}/>
            </Activity>
        </>
    )
}

export default DoctorsList