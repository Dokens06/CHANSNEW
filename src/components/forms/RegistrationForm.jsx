import { useState } from 'react';
import { 
  Button, 
  Typography, 
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../providers/create';
import { useAlert } from '../../hooks/useAlert';
import AccountDetail from './registration/AccountDetail';
import AddressDetail from './registration/AddressDetail'; 

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    middlename: '',
    lastname: '',
    email_address: '',
    birthdate: null,
    gender: '',
    phone_number: '',
    description: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    address_line: '',
    postal_code: '',
    country: 'Philippines',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.email_address) {
      newErrors.email_address = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = 'Email is invalid';
    }
    if (!formData.birthdate) newErrors.birthdate = 'Birth date is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';

    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.province) newErrors.province = 'Province is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.barangay) newErrors.barangay = 'Barangay is required';
    if (!formData.address_line) newErrors.address_line = 'Address line is required';
    if (!formData.postal_code) newErrors.postal_code = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (typeof e === 'string') {
      setFormData({ 
        ...formData,
        phone_number: e
      });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Format the data to match the API expected format
      const userData = {
        username: formData.username,
        password: formData.password,
        firstname: formData.firstname,
        middlename: formData.middlename || '',
        lastname: formData.lastname,
        email_address: formData.email_address,
        birthdate: formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : '',
        gender: formData.gender,
        phone_number: formData.phone_number,
        description: formData.description || '',
        address: {
          region: formData.region,
          province: formData.province,
          city: formData.city,
          barangay: formData.barangay,
          address_line: formData.address_line,
          postal_code: formData.postal_code,
          country: formData.country,
        },
      };

      await register(userData);
      
      showAlert('Successfully registered!', 'success');
      navigate('/login');
    } catch (error) {
      showAlert(error.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <AccountDetail
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          errors={errors}
        />
        <AddressDetail
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default RegistrationForm;