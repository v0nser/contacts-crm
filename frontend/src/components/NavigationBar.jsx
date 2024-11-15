import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation(); 

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = (
    <Box sx={{ width: 250 }} role="presentation">
      <Button
        color="inherit"
        component={Link}
        to="/"
        onClick={toggleDrawer(false)}
        sx={{ justifyContent: 'flex-start', width: '100%' }}
        variant={location.pathname === '/' ? 'outlined' : 'text'} 
      >
        Add Contact
      </Button>
      <Button
        color="inherit"
        component={Link}
        to="/contactList"
        onClick={toggleDrawer(false)}
        sx={{ justifyContent: 'flex-start', width: '100%' }}
        variant={location.pathname === '/contactList' ? 'outlined' : 'text'} 
      >
        Contact List
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              variant={location.pathname === '/' ? 'outlined' : 'text'} 
            >
              Add Contact
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/contactList"
              variant={location.pathname === '/contactList' ? 'outlined' : 'text'} 
            >
              Contact List
            </Button>
          </Box>
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {menuItems}
      </Drawer>
    </>
  );
};

export default NavigationBar;