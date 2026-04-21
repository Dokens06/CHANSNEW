import React, { useEffect, useState } from 'react'
import { Box, TextField, Card, Typography, Button } from '@mui/material'
import { createDoctor, updateDoctor } from '../../providers/create';
import { useAlert } from '../../hooks/useAlert';
import { PrimaryColor, PrimaryThemeColor } from '../../utils/constant';

const DoctorForm = ({ onClose, setLoadList, isPopup = false, doctor = {} }) => {
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({});
    const [doctorData, setDoctorData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        description: '',
        is_active: true,
    });
    
    useEffect(() => {
        const updateDoctorData = () => {
            if (doctor.id) {
                setDoctorData(doctor);
            }
        }

        updateDoctorData()
    }, [doctor]);

    const handleChange = (e) => {
        setDoctorData({
            ...doctorData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        let updateRes;
        if (doctor.id) {
            try {
                updateRes = await updateDoctor(doctor.id, doctorData);
            } catch (error) {
                showAlert(error.message, 'error');
            }
        } else {
            try {
                updateRes = await createDoctor(doctorData);
            } catch (error) {
                showAlert(error.message, 'error');
            }
        }

        if (updateRes.status === 200 || updateRes.status === 201) {
            showAlert(updateRes.status === 200 ? 'Medical personnel updated successfully' : 'Medical personnel added successfully', 'success');
            onClose();
            setLoadList(true);
        } else {
            showAlert('Something went wrong', 'error')
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!doctorData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!doctorData.lastname.trim()) newErrors.lastname = 'Last name is required';
        if (!doctorData.description.trim()) newErrors.description = 'Description is required';
        
        setErrors(newErrors);
        showAlert(Object.keys(newErrors).length === 0 ? 'Medical personnel added successfully' : 'Please fill all required fields', Object.keys(newErrors).length === 0 ? 'success' : 'error');
        return Object.keys(newErrors).length === 0;
    };

    return (
        <Card variant="outlined" className="max-w-[600px] p-4" component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Add medical personnel
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={doctorData.firstname}
                    onChange={handleChange}
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                    required
                />
                <TextField
                    fullWidth
                    label="Middle Name"
                    name="middlename"
                    value={doctorData.middlename}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    value={doctorData.lastname}
                    onChange={handleChange}
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                    required
                />
            </Box>
            
            <TextField
                multiline
                rows={3}
                fullWidth
                label="Description"
                name="description"
                value={doctorData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" sx={{ ...PrimaryThemeColor }} type="submit">Save</Button>
                {!isPopup && <Button variant="outlined" sx={{ borderColor: PrimaryColor, color: PrimaryColor }} onClick={onClose}>Cancel</Button>}
            </Box>
        </Card>
    )
}

export default DoctorForm