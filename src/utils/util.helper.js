export const getDateStatus = (row) => {
    console.log(row)
    const currentDate = new Date();

    const statusTypes = {
        event: {
            CANCELED: 'CANCELED',
            DONE: 'DONE',
            POSTED: 'POSTED'
        },
        appointment: {
            CANCELED: 'DISAPPROVED',
            DONE: 'DONE',
            POSTED: 'APPROVED'
        }
    }

    if (row.event_deleted_at) {
        return statusTypes[row.entity_type].CANCELED;
    }

    if (currentDate > new Date(row.event_date)) {
        return statusTypes[row.entity_type].DONE;
    }
    return statusTypes[row.entity_type].POSTED;
}

export const getStatus = (row) => {
    if (row.is_active) {
        return 'ACTIVE';
    }
    return 'INACTIVE';
}

export const getDate = (date) => {
    const dateFormated = new Date(date);
    const year = dateFormated.getFullYear();
    const month = String(dateFormated.getMonth() + 1).padStart(2, '0');
    const day = String(dateFormated.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}