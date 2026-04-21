import React, { useState } from 'react'
import { Box, TextField, InputAdornment, IconButton, MenuItem, FormControl, InputLabel, Card, Typography } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MuiTelInput } from 'mui-tel-input'
import { GENDER_OPTIONS } from '../../../utils/constant'

const AccountDetail = ({ formData, setFormData, handleChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
            Account Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
                fullWidth
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={!!errors.firstname}
                helperText={errors.firstname}
                required
            />
            <TextField
                fullWidth
                label="Middle Name"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                error={!!errors.lastname}
                helperText={errors.lastname}
                required
            />
        </Box>

        <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            required
        />

        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
            <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
            />
        </Box>

        <TextField
            fullWidth
            label="Email Address"
            name="email_address"
            type="email"
            value={formData.email_address}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email_address}
            helperText={errors.email_address}
            required
        />

        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                sx={{ width: '100%' }}
                label="Birth Date"
                value={formData.birthdate}
                onChange={(date) => 
                setFormData({ ...formData, birthdate: date })
                }
                renderInput={(params) => (
                <TextField 
                    {...params} 
                    fullWidth
                    error={!!errors.birthdate}
                    helperText={errors.birthdate}
                    required
                />
                )}
            />
            </LocalizationProvider>
            
            <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                required
            >
                {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>

        <FormControl fullWidth variant="outlined">
            <InputLabel className="bg-white" shrink>
            Phone
            </InputLabel>
            <MuiTelInput
                name="phone_number"
                value={formData.phone_number}
                onChange={(value) => {
                    // Remove all whitespace from the phone number
                    const cleanValue = value.replace(/\s+/g, '');
                    handleChange({
                        target: {
                            name: 'phone_number',
                            value: cleanValue
                        }
                    });
                }}
                defaultCountry="PH"
                fullWidth
                disableDropdown
            />
        </FormControl>

        <TextField
            fullWidth
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
        />
    </Card>
  )
}

export default AccountDetail