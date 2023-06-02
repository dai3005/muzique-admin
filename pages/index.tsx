import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@muzique/styles/Home.module.css';
import { Button } from '@mui/material';
import ManageSongPage from './manage-song';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return <ManageSongPage />;
}
