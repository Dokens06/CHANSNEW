import React, { useContext, useEffect, useState, lazy, Activity } from 'react'
import { Box, Paper, Typography, List, ListItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { useAlert } from '../../hooks/useAlert';
import { getServices } from '../../providers/list';
import ActionButtons from '../ActionButtons';
import { LoadListContext } from '../../contexts/LoadListContext';
import { getStatus } from '../../utils/util.helper';
import { AnnouncementColor, PrimaryColor } from '../../utils/constant';
import ToolbarFilter from '../ToolbarFilter';

const DoctorsPopup = lazy(() => import('../popup/DoctorsPopup'));
const EditServicePopup = lazy(() => import('../popup/EditServicePopup'));


const ServiceList = ({ loadList, setLoadList }) => {
    const { loadList: editLoadList, setLoadList: editSetLoadList } = useContext(LoadListContext);
    const { showAlert } = useAlert();
    
    const [isAddDoctor, setIsAddDoctor] = useState(false);
    const [isEditService, setIsEditService] = useState(false);
    const [idSelected, setIdSelected] = useState(null);
    
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const dropDownOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Medical personnel', value: 'doctor' },
    ];

    const columns = [
        { flex: 1, field: 'name', headerName: 'Name' },
        { flex: 1, field: 'description', headerName: 'Description' },
        {
            flex: 1,
            field: 'doctor_services',
            headerName: 'Medical personnel',
            sortable: false,
            renderCell: (params) => {
                const services = params.row.doctor_services || [];

                if (!services.length) return <span className="text-red-500 capitalize">No medical personnel</span>;
                return (
                    <List sx={{ padding: 0 }}>
                        {services.map((service) => (
                            <ListItem key={service.doctor.id} sx={{ padding: '4px 0' }}>
                                <span className="capitalize">— {service.doctor?.lastname}, {service.doctor?.firstname}</span>
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
            <ActionButtons id={params.row.id} iconOnly addText="Select medical personnel" editText="Edit" onAdd={onAddDoctor} onEdit={onEditService}/>
        )},
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await getServices({ 
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    search,
                });
                setServices(response.data.data.items || []);
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

    const onAddDoctor = (id) => {
        setIdSelected(id);
        setIsAddDoctor(true);
    };
    
    const onEditService = (id) => {
        setIdSelected(id);
        setIsEditService(true);
    }

    const handleAddDoctorClose = () => {
        setIsAddDoctor(false);
        setLoadList(true);
    };

    const handleEditServiceClose = () => {
        setIsEditService(false);
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
            <Box>
                <Typography variant="h6">
                    Services
                </Typography>
            </Box>
            <ToolbarFilter onSearch={handleSearch} dropDownOptions={dropDownOptions} showDateRange={false} />
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
            <Activity mode={isAddDoctor ? "visible" : "hidden"}>
                <DoctorsPopup open={isAddDoctor} handleClose={handleAddDoctorClose} id={idSelected}/>
            </Activity>
            <Activity mode={isEditService ? "visible" : "hidden"}>
                <EditServicePopup open={isEditService} handleClose={handleEditServiceClose} id={idSelected}/>
            </Activity>
        </>
    )
}

export default ServiceList