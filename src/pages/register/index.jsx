import React from 'react'
import { Box } from '@mui/material'
import RegistrationForm from '../../components/forms/RegistrationForm'
import PublicRoute from '../../routes/PublicRoute'

const RegisterPage = () => {
  return (
    <Box sx={{ maxWidth: '720px', margin: '0 auto' }}>
        <Box sx={{ maxWidth: '720px', margin: '0 auto' }}>
            <RegistrationForm />
        </Box>
    </Box>
  )
}


const ProtectedRegisterPage = PublicRoute(RegisterPage);
export default ProtectedRegisterPage