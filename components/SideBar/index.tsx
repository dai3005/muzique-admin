import { Inbox, Mail, Menu } from '@mui/icons-material';
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  Drawer,
  Stack,
  SxProps
} from '@mui/material';
import { ROUTER } from '@muzique/constants/router';
import Image from 'next/image';
import React from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
export const drawerWidth = 240;
const SideBar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const sideBar: {
    label: string;
    path: string;
    Icon: ({ color }: { color: string }) => JSX.Element;
  }[] = [
    {
      label: 'Tổng quan',
      path: ROUTER.HOME.INDEX,
      Icon: ({ color }) => <DashboardIcon htmlColor={color} />
    },
    {
      label: 'Bài hát',
      path: ROUTER.SONG.INDEX,
      Icon: ({ color }) => <MusicNoteIcon htmlColor={color} />
    },
    {
      label: 'Ca sĩ',
      path: ROUTER.ARTIST.INDEX,
      Icon: ({ color }) => <RecordVoiceOverIcon htmlColor={color} />
    },
    {
      label: 'Thể loại',
      path: ROUTER.GENRE.INDEX,
      Icon: ({ color }) => <AutoAwesomeMosaicIcon htmlColor={color} />
    },
    {
      label: 'Playlist',
      path: ROUTER.PLAYLIST.INDEX,
      Icon: ({ color }) => <QueueMusicIcon htmlColor={color} />
    },
    {
      label: 'Album',
      path: ROUTER.ALBUM.INDEX,
      Icon: ({ color }) => <LibraryMusicIcon htmlColor={color} />
    },
    {
      label: 'Người dùng',
      path: ROUTER.USER.INDEX,
      Icon: ({ color }) => <AccountCircleIcon htmlColor={color} />
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const CustomDrawer = () => (
    <div>
      <Stack alignItems={'center'} justifyContent={'center'} py={'5px'}>
        <Image src={'/images/Logo.svg'} alt="logo" width={75} height={75} />
      </Stack>
      <Divider />
      <List>
        {sideBar.map(({ label, path, Icon }) => (
          <Stack
            direction={'row'}
            key={path}
            spacing={2}
            onClick={() => {
              router.push(path);
            }}
            sx={{
              m: 1,
              px: 1,
              py: 1,
              borderRadius: '5px',
              cursor: 'pointer',
              '&:hover': {
                opacity: '0.8',
                backgroundColor: 'info.main',
                color: 'white'
              },
              ...(router.pathname === path
                ? {
                    color: 'white',
                    backgroundColor: 'info.main'
                  }
                : {})
            }}
          >
            <Icon color={router.pathname === path ? 'white' : ''} />
            <Typography>{label}</Typography>
          </Stack>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      ></AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          <CustomDrawer />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          <CustomDrawer />
        </Drawer>
      </Box>
    </>
  );
};

export default SideBar;
