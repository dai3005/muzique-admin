import { Column, Filter } from '@devexpress/dx-react-grid';
import Table, { Action, Col } from '@muzique/components/pages/CustomTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { Song, SongDetail } from '@muzique/models/Song';
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, responsiveFontSizes } from '@mui/material';
import Swal from 'sweetalert2';
import SongModal from '@muzique/components/pages/SongModal';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const ManageSongPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [songDetail, setSongDetail] = useState<SongDetail>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSongDetail(undefined);
    setOpen(false);
  };

  const cols: Col[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: Song) => {
        let image = getFile(row.coverImageUrl);
        return (
          <img
            width={100}
            height={100}
            style={{ borderRadius: '3px', objectFit: 'contain' }}
            src={`${image}`}
            alt="song"
          />
        );
      },
      filteringEnabled: false
    },
    { name: 'name', title: 'Tên bài hát' },
    {
      name: 'audioUrl',
      title: 'Audio',
      getCellValue: (row: Song) => {
        let song = getFile(row.audioUrl);
        return (
          <AudioPlayer
            src={song}
            autoPlay={false}
            autoPlayAfterSrcChange={false}
          />
        );
      },
      filteringEnabled: false
    },
    { name: 'description', title: 'Mô tả', filteringEnabled: false },
    {
      name: 'createdAt',
      title: 'Ngày tạo',
      getCellValue: (row: Song) => dayjs(row.createdAt).format('DD/MM/YYYY'),
      filteringEnabled: false
    }
  ];

  const actions: Action[] = [
    {
      icon: <EditIcon htmlColor="blue" sx={{ cursor: 'pointer' }} />,
      onClick: (song: Song) => editSong(song.songId)
    },
    {
      icon: <DeleteOutlineIcon htmlColor="red" sx={{ cursor: 'pointer' }} />,
      onClick: (song: Song) => deleteSong(song.songId)
    }
  ];
  const tableColumnExtensions = [
    { columnName: 'name', width: 300 },
    { columnName: 'coverImageUrl', width: 150 },
    { columnName: 'audioUrl', width: 400 },
    { columnName: 'createdAt', width: 150 },
    { columnName: 'action', width: 150 }
  ];
  const getListSong = useCallback(
    _.debounce((f: Filter[], p, cp) => {
      apiCall({
        url: '/getListSong',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT,
        params: {
          page: cp + 1,
          rowperpage: p,
          keyword: f?.find((e) => e.columnName === 'name')?.value
        }
      }).then((response) => {
        setSongs(response.data.listSong);
        setTotalCount(response.data.totalRes);
      });
    }, 500),
    []
  );

  useEffect(() => {
    getListSong(filters ?? [], pageSize, currentPage);
  }, [filters, pageSize, currentPage]);

  const editSong = (id: number) => {
    apiCall({
      url: '/getSongDetail',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        id
      }
    }).then((response) => {
      setSongDetail(response.data);
      setOpen(true);
    });
  };

  const deleteSong = (id: number) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có chắc là muốn xoá bài hát này?`,
      showCancelButton: true,
      didClose: function () {
        return;
      },
      preConfirm: function () {
        apiCall({
          url: '/deleteSong',
          method: 'delete',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            id
          }
        }).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Bạn đã xoá bài hát này thành công!',
              preConfirm: function () {
                getListSong(filters ?? [], pageSize, currentPage);
              }
            });
          }
        });
      }
    });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ margin: '20px' }}
        onClick={() => setOpen(true)}
      >
        Tạo bài hát mới
      </Button>
      <Table
        rows={songs}
        filters={filters}
        onFiltersChange={setFilters}
        pageSize={pageSize}
        totalCount={totalCount}
        currentPage={currentPage}
        setCurrentPage={(e) => {
          setCurrentPage(e);
        }}
        setPageSize={(e) => {
          setPageSize(e);
        }}
        cols={cols}
        actions={actions}
        tableColumnExtensions={tableColumnExtensions}
      />
      <SongModal
        key={songDetail?.song.songId ?? 'createSongModal'}
        song={songDetail}
        open={open}
        handleClose={handleClose}
        reloadPage={() => {
          getListSong(filters ?? [], pageSize, currentPage);
        }}
      />
    </>
  );
};

export default ManageSongPage;
