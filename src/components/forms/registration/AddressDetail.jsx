import React from 'react'
import { Box, TextField, Card, Typography } from '@mui/material'

const AddressDetail = ({ formData, handleChange, errors }) => {
  return (
    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
            Address Details
        </Typography>
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            error={!!errors.region}
            helperText={errors.region}
            required
        />
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            error={!!errors.province}
            helperText={errors.province}
            required
        />
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            required
        />
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Barangay"
            name="barangay"
            value={formData.barangay}
            onChange={handleChange}
            error={!!errors.barangay}
            helperText={errors.barangay}
            required
        />
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Address Line"
            name="address_line"
            value={formData.address_line}
            onChange={handleChange}
            error={!!errors.address_line}
            helperText={errors.address_line}
            required
        />
        <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            error={!!errors.postal_code}
            helperText={errors.postal_code}
            required
        />
    </Card>
  )
}

export default AddressDetail