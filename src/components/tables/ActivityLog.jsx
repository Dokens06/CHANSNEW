import { Activity, useContext, useEffect, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { getEventList } from '../../providers/list'
import { useAlert } from '../../hooks/useAlert'
import { LoadListContext } from '../../contexts/LoadListContext';
import { getDate, getDateStatus } from '../../utils/util.helper';
import { AnnouncementColor, PrimaryColor, ViewColor } from '../../utils/constant';
import { Typography, Box, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ToolbarFilter from '../ToolbarFilter';
import EditAppointmentPopup from '../popup/EditAppointmentPopup';
import ViewAppointmentPopup from '../popup/ViewAppointmentPopup';
import { deleteAnnouncement } from '../../providers/delete';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getEventsPdf } from '../../providers/detail';
import { cancelAnnouncement } from '../../providers/create';

const ActivityLog = ({ eventType = 'appointment', userType = 'admin' }) => {
    const { showAlert } = useAlert();
    const { loadList, setLoadList } = useContext(LoadListContext);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState({})
    const [totalItem, setTotalItem] = useState(0);
    const [activityLogs, setActivityLogs] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [sortModel, setSortModel] = useState([{ field: 'event_date', sort: 'desc' }]);

    const [isEditAppointment, setIsEditAppointment] = useState(false);
    const [isViewAppointment, setIsViewAppointment] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deleteIdSelected, setDeleteIdSelected] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    const [otherDeleteReason, setOtherDeleteReason] = useState('');
    const [idSelected, setIdSelected] = useState(null);

    const deleteReasonOptions = [
        'Attending seminar',
        'Meeting',
        'Not around/absent',
        'Others',
    ];

    const columnsByUserType = useMemo(() => {
        const columns = [
            {
                flex: 1, field: 'user', headerName: 'Requested By', sortable: false, renderCell: (params) => {
                    return <span className="capitalize">{params.row.user_lastname}, {params.row.user_firstname}</span>;
                }
            },
            {
                flex: 1, field: 'doctor', headerName: 'Medical personnel', sortable: false, renderCell: (params) => {
                    return <span className="capitalize">{params.row.doctor_lastname}, {params.row.doctor_firstname}</span>;
                }
            },
            {
                flex: 1, field: 'service', headerName: 'Service', sortable: false, renderCell: (params) => {
                    return <span className="capitalize">{params.row.service_name}</span>;
                }
            },
            {
                flex: 1, field: 'event_date', headerName: 'Appointment Date', sortable: true, renderCell: (params) => {
                    const date = getDate(params.row.event_date);
                    return <span className="capitalize">{date}</span>;
                }
            },
            {
                flex: 1, field: 'status', headerName: 'Status', sortable: false, renderCell: (params) => {
                    const status = getDateStatus(params.row);
                    const sx = {
                        textTransform: 'uppercase',
                    };

                    if (status === 'DONE' || status === 'DISAPPROVED') {
                        sx.color = AnnouncementColor;
                    } else {
                        sx.color = PrimaryColor;
                    }

                    return <Typography variant="body2" sx={sx} className="capitalize">{status}</Typography>;
                }
            },
            {
                flex: 1, field: 'action', headerName: 'Action', sortable: false, renderCell: (params) => {
                    return (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Tooltip title="View" arrow disableInteractive>
                                <Button color="primary" variant="outlined" sx={{ textTransform: 'none', borderColor: ViewColor, color: ViewColor }} size="small" onClick={() => onViewAppointment(params.row.event_id)}><VisibilityIcon /></Button>
                            </Tooltip>
                            {!params.row.event_deleted_at && (
                                <>
                                    {userType !== 'admin' && (
                                        <Tooltip title="Edit" arrow disableInteractive>
                                            <Button color="success" variant="outlined" sx={{ textTransform: 'none', borderColor: PrimaryColor, color: PrimaryColor }} size="small" onClick={() => onEditAppointment(params.row.event_id)}><EditIcon /></Button>
                                        </Tooltip>
                                    )}
                                    <Activity mode={new Date(params.row.event_date) > new Date() ? 'visible' : 'hidden'}>
                                        <Tooltip title="Cancel" arrow disableInteractive>
                                            <Button color="error" variant="contained" sx={{ textTransform: 'none' }} size="small" onClick={() => onOpenDeletePopup(params.row.event_id)}><DoDisturbIcon /></Button>
                                        </Tooltip>
                                    </Activity>
                                </>
                            )}
                        </Box>
                    )
                }
            }
        ];

        // if (userType === 'admin') {
        //     return columns.filter((col) => col.field !== 'action');
        // }

        if (userType !== 'admin') {
            return columns.filter((col) => col.field !== 'user');
        }

        return columns;
    }, [userType]);

    const dropDownOptions = [
        { label: 'Medical personnel', value: 'doctor' },
        { label: 'Service', value: 'service_name' },
        { label: 'User', value: 'user' },
    ]


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getEventList({
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    type: eventType,
                    search,
                    from: dateRange.from,
                    to: dateRange.to,
                    sort_by: sortModel?.[0]?.field === 'event_date' ? 'appointment_date' : sortModel?.[0]?.field,
                    sort_order: sortModel?.[0]?.sort
                });
                setActivityLogs(response.data.data.items || []);
                setTotalItem(response.data.data.total_item || 0);
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoadList(false);
            }
        };

        fetchDoctors();
    }, [paginationModel.page, paginationModel.pageSize, eventType, loadList, search, dateRange, sortModel]);

    const handleSearch = (query, field, from, to) => {
        if (query && field) {
            setSearch(`${field}::${query}`)
        } else {
            setSearch('');
        }

        if (from && to) {
            setDateRange({ from, to });
        } else {
            setDateRange({});
        }
    }

    const onViewAppointment = (id) => {
        setIdSelected(id);
        setIsViewAppointment(true);
    }

    const handleViewAppointmentClose = () => {
        setIsViewAppointment(false);
        setLoadList(true);
    }

    const onEditAppointment = (id) => {
        setIdSelected(id);
        setIsEditAppointment(true);
    }

    const handleEditAppointmentClose = () => {
        setIsEditAppointment(false);
        setLoadList(true);
    }

    const onOpenDeletePopup = (id) => {
        setDeleteIdSelected(id);
        setDeleteReason('');
        setOtherDeleteReason('');
        setIsDeletePopupOpen(true);
    };

    const onCloseDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setDeleteIdSelected(null);
        setDeleteReason('');
        setOtherDeleteReason('');
    };

    const onDeleteAppointment = async (id) => {
        try {
            const res = await deleteAnnouncement(id);
            if (res.status === 200) {
                showAlert('Appointment cancelled successfully', 'success');
                setLoadList(true);
                onCloseDeletePopup();
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    const onCancelAppointment = async (id, reason) => {
        try {
            const res = await cancelAnnouncement(id, { reason });
            if (res.status === 200) {
                showAlert('Appointment cancelled successfully', 'success');
                setLoadList(true);
                onCloseDeletePopup();
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    const onConfirmAdminCancel = async () => {
        if (!deleteReason) {
            showAlert('Please select a reason before deleting.', 'error');
            return;
        }

        if (deleteReason === 'Others' && !otherDeleteReason.trim()) {
            showAlert('Please specify the reason for Others.', 'error');
            return;
        }

        let reasonToSend = '';
        if (deleteReason === 'Attending seminar') {
            reasonToSend = 'the doctor attending a seminar';
        } else if (deleteReason === 'Meeting') {
            reasonToSend = 'the doctor required to attend a meeting';
        } else if (deleteReason === 'Not around/absent') {
            reasonToSend = 'the doctor not being available on the selected date';
        } else if (deleteReason === 'Others') {
            reasonToSend = otherDeleteReason.trim();
        } else {
            reasonToSend = deleteReason;
        }

        await onCancelAppointment(deleteIdSelected, reasonToSend);
        await setIsDeletePopupOpen(false);
        setLoadList(true);
        showAlert('Appointment canceled successfully', 'success');
    };

    const downloadPdf = async (from, to) => {
        try {
            const response = await getEventsPdf({ page: 1, size: 50, from, to, type: eventType });

            // response.data is now a proper binary buffer
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "appointments.pdf";
            a.click();

            window.URL.revokeObjectURL(url); // clean up
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <ToolbarFilter onSearch={handleSearch} dropDownOptions={dropDownOptions} enableExportPDF={userType === 'admin'} disableButtonExportPDF={totalItem == 0} onExportPDF={downloadPdf} />
            <DataGrid
                disableColumnMenu
                rows={activityLogs}
                columns={columnsByUserType}
                getRowId={(row) => row.event_id}
                getRowHeight={() => 'auto'}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={(model) => {
                    setSortModel(model);
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                sortingMode="server"
                pageSizeOptions={[5, 10]}
                sx={{
                    border: 0,
                    '& .MuiDataGrid-cell': {
                        padding: '8px 16px',
                        whiteSpace: 'normal',
                        lineHeight: '1.5'
                    }
                }}
                loading={loadList}
                paginationMode="server"
                rowCount={totalItem}
                disableRowSelectionOnClick
            />
            <Activity mode={isEditAppointment ? "visible" : "hidden"}>
                <EditAppointmentPopup open={isEditAppointment} handleClose={handleEditAppointmentClose} id={idSelected} />
            </Activity>
            <Activity mode={isViewAppointment ? "visible" : "hidden"}>
                <ViewAppointmentPopup open={isViewAppointment} handleClose={handleViewAppointmentClose} id={idSelected} />
            </Activity>
            <Dialog open={isDeletePopupOpen} onClose={onCloseDeletePopup} fullWidth maxWidth="sm">
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'grid', gap: 2 }}>
                    {userType === 'admin' ? (
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="delete-reason-label">Reason</InputLabel>
                                <Select
                                    labelId="delete-reason-label"
                                    label="Reason"
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                >
                                    {deleteReasonOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {deleteReason === 'Others' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Specify reason"
                                    value={otherDeleteReason}
                                    onChange={(e) => setOtherDeleteReason(e.target.value)}
                                    helperText="This specific reason will appear on SMS."
                                />
                            )}
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Are you sure you want to cancel this appointment?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDeletePopup} variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }}>
                        Cancel
                    </Button>
                    <Button onClick={() => userType === 'admin' ? onConfirmAdminCancel() : onDeleteAppointment(deleteIdSelected)} color="error" variant="contained">
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ActivityLog
