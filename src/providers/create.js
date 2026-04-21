import { axiosInstance } from '../utils/axiosInstance';
import { tryCatch } from '../utils/tryCatch';

export const register = async (userData) => {
    const data = await tryCatch(() => axiosInstance.post('/users', userData));

    return data;
}

export const createDoctor = async (doctorData) => {
    const data = await tryCatch(() => axiosInstance.post('/doctors', doctorData));

    return data;
}

export const updateDoctor = async (id, doctorData) => {
    const data = await tryCatch(() => axiosInstance.put(`/doctors/${id}`, doctorData));

    return data;
}

export const createService = async (serviceData) => {
    const data = await tryCatch(() => axiosInstance.post('/services', serviceData));

    return data;
}

export const updateService = async (id, serviceData) => {
    const data = await tryCatch(() => axiosInstance.put(`/services/${id}`, serviceData));

    return data;
}

export const createDoctorServiceByDoctorId = async (doctorServiceData) => {
    const { doctor_id, ...serviceData } = doctorServiceData;
    const data = await tryCatch(() => axiosInstance.post(`/doctor-services/doctor/${doctor_id}`, serviceData));

    return data;
}

export const createDoctorServiceByServiceId = async (doctorServiceData) => {
    const { service_id, ...serviceData } = doctorServiceData;
    const data = await tryCatch(() => axiosInstance.post(`/doctor-services/service/${service_id}`, serviceData));

    return data;
}


export const createEvent = async (eventData) => {
    const data = await tryCatch(() => axiosInstance.post('/events', eventData));

    return data;
}

export const updateEvent = async (id, eventData) => {
    const data = await tryCatch(() => axiosInstance.put(`/events/${id}`, eventData));

    return data;
}

export const updateBHWStatus = async (userId, isBHW) => {
    const data = await tryCatch(() => axiosInstance.put(`/users/${userId}/bhw`, { is_bhw: isBHW }));

    return data;
}

export const cancelAnnouncement = async (id, payload = {}) => {
    const data = await tryCatch(() => axiosInstance.post(`/events/${id}/cancel`, payload));

    return data;
}