import { Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const EventCalendarList = ({ loadList }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
    const columns = [
        {
            flex: 2,
            field: 'title',
            headerName: 'Title',
            sortable: false,
            renderCell: (params) => {
                const title = params.row.title;

                return <Typography sx={{ color: params.row.color }}>{title}</Typography>;
            },
        },
        { flex: 1, field: 'start_date', headerName: 'Date', sortable: false,
            renderCell: (params) => {
                const eventDate = new Date(params.row.start_date);
                const year = eventDate.getFullYear();
                const month = String(eventDate.getMonth() + 1).padStart(2, "0");
                const day = String(eventDate.getDate()).padStart(2, "0");
                
                return <Typography>{`${year}-${month}-${day}`}</Typography>;
            }
         },
        { flex: 1, field: 'event_type', headerName: 'Event Type', sortable: false,
            renderCell: (params) => {
                const event_type = params.row.event_type;

                return <Typography sx={{ color: params.row.color, textTransform: 'capitalize' }}>{event_type}</Typography>;
            },
        },
        
    ];

  return (
    <Paper sx={{ width: '100%' }}>
        <DataGrid
            disableColumnSorting
            disableColumnMenu
            rows={loadList}
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
            loading={false}
            paginationMode="client"
            disableRowSelectionOnClick
        />
    </Paper>
  )
}

export default EventCalendarList