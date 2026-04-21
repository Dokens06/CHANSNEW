import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, TextField, Typography } from '@mui/material'
import { useAlert } from '../../hooks/useAlert';
import { login } from '../../providers/auth';

import { PrimaryColor, PrimaryThemeColor } from '../../utils/constant';

const LoginForm = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState({
        username: false,
        password: false,
    });

    const validateForm = () => {
        let isValid = true;
        if (!loginData.username) {
            setError({ ...error, username: true });
            isValid = false;
        }
        if (!loginData.password) {
            setError({ ...error, password: true });
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            login(loginData.username, loginData.password).then((res) => {
                showAlert(res.message, 'success');
                navigate('/');
            }).catch((error) => {
                showAlert(error.message, 'error');
            });
        }
    };

  return (
    <Box component="form" onSubmit={handleSubmit}>
        <Box className="text-center space-y-4">
            <Box className="mx-auto w-50">
                <img src="rhu-logo.png" alt="RHU logo" />
            </Box>
            <Typography sx={{ fontSize: '2rem', fontWeight: '500' }} variant="h1">Welcome to RHU Villanueva</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
            <TextField
                error={error.username}
                helperText={error.username ? 'Please enter a valid username' : ''}
                label="Username"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <TextField
                error={error.password}
                helperText={error.password ? 'Please enter a valid password' : ''}
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
        </Box>
        {/* <Link sx={{ textDecoration: 'none' }} href="/register">forgot password?</Link> */}
        <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, ...PrimaryThemeColor }}
        >
            Login
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1">Don't have an account? <Link sx={{ color: PrimaryColor, textDecoration: 'none', fontWeight: 'bold' }} href="/register">Sign Up</Link></Typography>
        </Box>
    </Box>
  )
}

export default LoginForm