import { axiosInstance } from '../utils/axiosInstance';
import { tryCatch } from '../utils/tryCatch';

export const deleteDoctorService = async (doctorServiceData) => {
    const data = await tryCatch(() => axiosInstance.delete(`/doctor-services/doctor/${doctorServiceData.doctor_id}/service/${doctorServiceData.service_id}`));

    return data;
}

export const deleteAnnouncement = async (id) => {
    const data = await tryCatch(() => axiosInstance.delete(`/events/${id}`));

    return data;
}