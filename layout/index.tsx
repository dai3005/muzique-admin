import { Box } from '@mui/material';
import SideBar, { drawerWidth } from '@muzique/components/SideBar';
import React, { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
const AppLayout: FC<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar></SideBar>
      <Box
        component={'main'}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, flexGrow: 1, p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
