import { Box, CircularProgress } from '@mui/material';
import SideBar, { drawerWidth } from '@muzique/components/SideBar';
import { HEADER } from '@muzique/constants/header';
import { ROUTER } from '@muzique/constants/router';
import { apiCall } from '@muzique/helper/axios';
import Login from '@muzique/pages/login';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Props = {
  children: ReactNode;
};

const AppLayout: FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState(false);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (auth && router.pathname === ROUTER.LOGIN.INDEX) {
      router.push('/');
      setLoading(false);
    } else {
      apiCall({
        url: '/adminEndPoint',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT
      })
        .then((response) => {
          if (response.status == 200) {
            setAuth(true);
          }
        })
        .catch(() => {
          setAuth(false);
        })
        .finally(() => setLoading(false));
    }
  }, [auth, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (!auth) {
    return <Login />;
  }

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
