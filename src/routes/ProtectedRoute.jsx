import { useState } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookieHelper";
import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

const ProtectedRoute = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAuthenticated = !!getCookie("access_token");

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Header onMenuClick={handleDrawerToggle} />
        <SideMenu open={mobileOpen} onClose={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - 240px)` },
            marginTop: '64px'
          }}
        >
          <WrappedComponent {...props} />
        </Box>
      </Box>
    );
  };

  ComponentWithProtection.displayName = `Protected(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default ProtectedRoute;