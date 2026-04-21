import React from 'react'
import { Box } from '@mui/material'
import LoginForm from '../../components/forms/LoginForm'
import PublicRoute from '../../routes/PublicRoute';

const LoginPage = () => {
  return (
    <Box sx={{ maxWidth: '720px', margin: '0 auto' }}>
        <Box sx={{ maxWidth: '360px', margin: '0 auto' }}>
            <LoginForm />
        </Box>
    </Box>
  )
}

const ProtectedLoginPage = PublicRoute(LoginPage);
export default ProtectedLoginPage