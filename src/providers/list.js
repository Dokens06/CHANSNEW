import { axiosInstance } from '../utils/axiosInstance';
import { tryCatch } from '../utils/tryCatch';

export const getDoctors = async (params) => {
    const { page, size, search } = params;
    const data = await tryCatch(() => axiosInstance.get('/doctors', { params: { page, size, search } }));

    return data;
}

export const getUsers = async (params) => {
    const { page, size, search } = params;
    const data = await tryCatch(() => axiosInstance.get('/users', { params: { page, size, search } }));

    return data;
}

export const getServices = async (params) => {
    const { page, size, search } = params;
    const data = await tryCatch(() => axiosInstance.get('/services', { params: { page, size, search } }));

    return data;
}

export const getEventList = async (params) => {
    const { page, size, search, type, from, to, sort_by, sort_order, for_pdf } = params;
    const data = await tryCatch(() => axiosInstance.get('/events', { params: { page, size, search, type, from, to, sort_by, sort_order, for_pdf } }));

    return data;
}

export const getEventByCalendar = async (params) => {
    const { from, to, type } = params;
    const data = await tryCatch(() => axiosInstance.get('/events/calendar', { params: { from, to, type } }));

    return data;
}
