import { Activity, useContext, useEffect, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { getEventList } from '../../providers/list'
import { useAlert } from '../../hooks/useAlert'
import { LoadListContext } from '../../contexts/LoadListContext';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { PrimaryColor, AnnouncementColor, ViewColor } from '../../utils/constant';
import ToolbarFilter from '../ToolbarFilter';
import EditAnnouncementPopup from '../popup/EditAnnouncementPopup';
import ViewAnnouncementPopup from '../popup/ViewAnnouncementPopup';
import { deleteAnnouncement } from '../../providers/delete';
import { getDateStatus } from '../../utils/util.helper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AnnouncementList = ({ userType = 'admin' }) => {
    const { showAlert } = useAlert();
    const { loadList, setLoadList } = useContext(LoadListContext);
    const [totalItem, setTotalItem] = useState(0);
    const [activityLogs, setActivityLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState({})
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [isEditAnnouncement, setIsEditAnnouncement] = useState(false);
    const [isViewAnnouncement, setIsViewAnnouncement] = useState(false);
    const [idSelected, setIdSelected] = useState(null);

    const onViewAnnouncement = (id) => {
        setIdSelected(id);
        setIsViewAnnouncement(true);
    }

    const handleViewAnnouncementClose = () => {
        setIsViewAnnouncement(false);
        setLoadList(true);
    }

    const onEditAnnouncement = (id) => {
        setIdSelected(id);
        setIsEditAnnouncement(true);
    }

    const handleEditAnnouncementClose = () => {
        setIsEditAnnouncement(false);
        setLoadList(true);
    }

    const onDeleteAnnouncement = async (id) => {
        try {
            const res = await deleteAnnouncement(id);
            if (res.status === 200) {
                showAlert('Announcement deleted successfully', 'success');
                setLoadList(true);
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    const columnsByUserType = useMemo(() => {
        const columns = [
            {
                flex: 1, field: 'name', headerName: 'Title', renderCell: (params) => {
                    return <span className="capitalize" title={params.row.announcement_description}>{params.row.announcement_name}</span>;
                }
            },
            {
                flex: 1, field: 'event_date', headerName: 'Event Date', renderCell: (params) => {
                    const date = new Date(params.row.event_date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return <span className="capitalize">{year}-{month}-{day}</span>;
                }
            },
            {
                flex: 1, field: 'status', headerName: 'Status', renderCell: (params) => {
                    const status = getDateStatus(params.row);
                    const sx = {
                        textTransform: 'uppercase',
                    };

                    if (status === 'DONE' || status === 'CANCELED') {
                        sx.color = AnnouncementColor;
                    } else {
                        sx.color = PrimaryColor;
                    }

                    return <Typography variant="body2" sx={sx} className="capitalize">{status}</Typography>;
                }
            },
            {
                flex: 1, field: 'action', headerName: 'Action', renderCell: (params) => {
                    return (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Tooltip title="View" arrow disableInteractive>
                                <Button color="success" variant="outlined" sx={{ textTransform: 'none', borderColor: ViewColor, color: ViewColor }} size="small" onClick={() => onViewAnnouncement(params.row.event_id)}><VisibilityIcon /></Button>
                            </Tooltip>
                            {!params.row.event_deleted_at && (
                                <>
                                    <Tooltip title="Edit" arrow disableInteractive>
                                        <Button color="success" variant="outlined" sx={{ textTransform: 'none', borderColor: PrimaryColor, color: PrimaryColor }} size="small" onClick={() => onEditAnnouncement(params.row.event_id)}><EditIcon /></Button>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow disableInteractive>
                                        <Button color="error" variant="contained" sx={{ textTransform: 'none' }} size="small" onClick={() => onDeleteAnnouncement(params.row.event_id)}><DeleteIcon /></Button>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    )
                }
            }
        ];

        if (userType === 'admin') {
            return columns;
        }

        return columns.filter((col) => col.field !== 'action');
    }, [userType]);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEventList({
                    page: paginationModel.page + 1,
                    size: paginationModel.pageSize,
                    search,
                    type: 'event',
                    from: dateRange.from,
                    to: dateRange.to
                });
                setActivityLogs(response.data.data.items || []);
                setTotalItem(response.data.data.total_item || 0);
            } catch (err) {
                showAlert(err.message, 'error');
            } finally {
                setLoadList(false);
            }
        };

        fetchEvents();
    }, [paginationModel.page, paginationModel.pageSize, loadList, search, dateRange]);

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

    return (
        <>
            <ToolbarFilter onSearch={handleSearch} dropDownOptions={[{ label: 'Title', value: 'announcement_name' }]} />
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <DataGrid
                    disableColumnSorting
                    disableColumnMenu
                    rows={activityLogs}
                    columns={columnsByUserType}
                    getRowId={(row) => row.event_id}
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
                    loading={loadList}
                    paginationMode="server"
                    rowCount={totalItem}
                    disableRowSelectionOnClick
                />
            </Box>
            <Activity mode={isEditAnnouncement ? "visible" : "hidden"}>
                <EditAnnouncementPopup open={isEditAnnouncement} handleClose={handleEditAnnouncementClose} id={idSelected} />
            </Activity>
            <Activity mode={isViewAnnouncement ? "visible" : "hidden"}>
                <ViewAnnouncementPopup open={isViewAnnouncement} handleClose={handleViewAnnouncementClose} id={idSelected} />
            </Activity>
        </>
    )
}

export default AnnouncementList