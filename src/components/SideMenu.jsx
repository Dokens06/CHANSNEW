import React, { lazy, useState, useEffect } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery, Button, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../providers/auth';
import { getEventList } from '../providers/list';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';
import { getCookie } from '../utils/cookieHelper';
import { MenuHoverColor, MenuActiveColor, SecondaryColor } from '../utils/constant';

const ConfirmationPopup = lazy(() => import('../components/popup/ConfirmationPopup'))

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon />, access: 'all' },
  { text: 'Announcement', path: '/announcement', icon: <AnnouncementIcon />, access: 'all' },
  { text: 'Appointments', path: '/appointments', icon: <BookOnlineIcon />, access: 'all' },
  { text: 'Users', path: '/users', icon: <PeopleIcon />, access: 'admin' },
  { text: 'Medical Personnel', path: '/medical-personnels', icon: <MedicationIcon />, access: 'admin' },
  { text: 'Services', path: '/services', icon: <VaccinesIcon />, access: 'admin' },
];

const SideMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const role = getCookie('user_role');
    if (role !== 'admin') return;

    let isMounted = true;
    const fetchAppointmentCount = async () => {
      try {
        const today = new Date();
        const toIso = (d) => d.toISOString().split('T')[0];
        const response = await getEventList({
          page: 1,
          size: 1,
          type: 'appointment',
          from: toIso(today),
          to: toIso(new Date(today.getFullYear() + 10, 11, 31)),
          for_pdf: true,
        });

        if (!isMounted) return;
        setAppointmentCount(response?.data?.data?.total_item || 0);
      } catch (error) {
        // ignore
      }
    };

    fetchAppointmentCount();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={onClose}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px', // Height of the header
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        <Divider />
        <List>
          {menuItems.map((item) => {
            if (item.access === getCookie('user_role') || item.access === 'all') 
              return (
                <ListItemButton
                  button={Button}
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: MenuActiveColor,
                      '&:hover': {
                        backgroundColor: MenuHoverColor,
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{
                      '&.MuiListItemIcon-root': {
                        color: SecondaryColor
                      }
                    }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      item.path === '/appointments' && getCookie('user_role') === 'admin' && appointmentCount > 0 ? (
                        <Badge badgeContent={appointmentCount} color="error" max={99}>
                          <span>{item.text}</span>
                        </Badge>
                      ) : (
                        item.text
                      )
                    }
                  />
                </ListItemButton>
              )
          })}
          <ListItemButton
            button={Button}
            key="logout"
            onClick={() => setOpenConfirmationPopup(true)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: MenuActiveColor,
                '&:hover': {
                  backgroundColor: MenuHoverColor,
                },
              },
            }}
          >
            <ListItemIcon sx={{
                '&.MuiListItemIcon-root': {
                  color: SecondaryColor
                }
              }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <ConfirmationPopup
        open={openConfirmationPopup}
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setOpenConfirmationPopup(false)}
      />
    </>
  );
};

export default SideMenu;