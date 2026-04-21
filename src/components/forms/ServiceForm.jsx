import React, { useEffect, useState } from 'react'
import { createService, updateService } from '../../providers/create';
import { useAlert } from '../../hooks/useAlert';
import { Card, TextField, Button, Box, Typography } from '@mui/material'
import { PrimaryColor, PrimaryThemeColor } from '../../utils/constant';

const ServiceForm = ({ onClose, setLoadList, isPopup = false, service = {} }) => {
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({});
    const [serviceData, setServiceData] = useState({
        name: '',
        description: '',
        is_active: true,
    });

    useEffect(() => {
        const updateServiceData = () => {
            if (service.id) {
                setServiceData(service);
            }
        }

        updateServiceData()
    }, [service]);

    const handleChange = (e) => {
        setServiceData({
            ...serviceData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let updateRes;
        if (service.id) {
            try {
                updateRes = await updateService(service.id, serviceData);
            } catch (error) {
                showAlert(error.message, 'error');
            }
        } else {
            try {
                updateRes = await createService(serviceData);
            } catch (error) {
                showAlert(error.message, 'error');
            }
        }

        if (updateRes.status === 200 || updateRes.status === 201) {
            showAlert(updateRes.status === 200 ? 'Service updated successfully' : 'Service added successfully', 'success');
            onClose();
            setLoadList(true);
        } else {
            showAlert('Something went wrong', 'error')
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!serviceData.name.trim()) newErrors.name = 'Name is required';
        if (!serviceData.description.trim()) newErrors.description = 'Description is required';
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showAlert('Please fill all required fields', 'error');
            return false;
        }
        return true;
    };
  return (
    <Card variant="outlined" className="max-w-[600px] p-4" component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
            {service.id ? 'Edit Service' : 'Add Service'}
        </Typography>
        <Box className="flex flex-col gap-4">
            <TextField
                fullWidth
                label="Name"
                name="name"
                value={serviceData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
            />
            <TextField
                multiline
                rows={3}
                fullWidth
                label="Description"
                name="description"
                value={serviceData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
            />
            </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" sx={{ ...PrimaryThemeColor }} type="submit">Save</Button>
            {!isPopup && <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={onClose}>Cancel</Button>}
        </Box>
    </Card>
  )
}

export default ServiceForm