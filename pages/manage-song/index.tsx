import { Column, Filter } from '@devexpress/dx-react-grid';
import Table, { Action, Col } from '@muzique/components/pages/CustomTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { Song } from '@muzique/models/Song';
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { responsiveFontSizes } from '@mui/material';
import Swal from 'sweetalert2';

const ManageSongPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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
            style={{ borderRadius: '3px' }}
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
          <audio controls>
            <source src={`${song}`} type="audio/mpeg"></source>
          </audio>
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
    { columnName: 'coverImageUrl', width: 150 },
    { columnName: 'audioUrl', width: 350 },
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
    console.log(id);
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
  );
};

export default ManageSongPage;
