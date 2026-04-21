import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { PrimaryThemeColor } from '../utils/constant';

const Btn = ({
  label,
  fullWidth,
  onClick,
  to,
  component,
  isLoading,
  ...rest
}) => {
  const isLink = !!to;
  const extraProps = {};

  if (component) {
    extraProps.component = component;
  }

  if (isLink) {
    extraProps.to = to;
  }

  return (
    <Button
      type={component ? undefined : 'button'}
      variant="contained"
      size="small"
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        ...PrimaryThemeColor
      }}
      {...extraProps}
      {...rest}
    >
      {isLoading ? (
        <>
          <CircularProgress size={24} className="mr-3 text-white" />
          {label}
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default Btn;
