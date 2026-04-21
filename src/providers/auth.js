import { axiosInstance } from "../utils/axiosInstance";
import { setCookie, removeCookie } from "../utils/cookieHelper";

export const login = async (username, password) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', { username, password });
      setCookie('access_token', data.access_token);
      setCookie('user_id', data.user.id);
      setCookie('user_name', data.user.username);
      setCookie('user_role', data.user.role);
      setCookie('first_name', data.user.first_name);
      setCookie('middle_name', data.user.middle_name);
      setCookie('last_name', data.user.last_name);
      setCookie('email_address', data.user.email_address);

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      return {
        success: true,
        message: 'Login successful',
        redirectTo: '/',
      };
    } catch (error) {
      console.log(error);
      throw Error('Invalid username or password', error);
    }
}

export const logout = async () => {
    removeCookie('access_token');
    removeCookie('user_id');
    removeCookie('user_name');
    removeCookie('user_role');
    removeCookie('first_name');
    removeCookie('middle_name');
    removeCookie('last_name');
    removeCookie('email_address');
    return {
      success: true,
      redirectTo: '/login',
    };
}