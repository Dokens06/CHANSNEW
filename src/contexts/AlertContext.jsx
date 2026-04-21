import { createContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [severity, setSeverity] = useState('info');

  const showAlert = (
    message,
    severity = 'info',
    fields
  ) => {
    setMessage(message);
    setErrorFields(fields || []);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {Array.isArray(message) ? (
            <ul>
              {message.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          ) : (
            message
          )}
          {errorFields.length > 0 && (
            <ul>
              {errorFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          )}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export { AlertContext };
