import { Filter } from '@devexpress/dx-react-grid';
import Table, { Col, Action } from '@muzique/components/pages/CustomTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { Playlist } from '@muzique/models/Playlist';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ManagePlaylistPage = () => {
  const [playlist, setPlaylist] = useState<Playlist[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const cols: Col[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: Playlist) => {
        let image = getFile(row.coverImageUrl);
        return (
          <img
            width={100}
            height={100}
            style={{ borderRadius: '3px', objectFit: 'contain' }}
            src={`${image}`}
            alt="artist"
          />
        );
      },
      filteringEnabled: false
    },
    { name: 'name', title: 'Tên thể loại' },
    { name: 'description', title: 'Mô tả', filteringEnabled: false },
    {
      name: 'createdAt',
      title: 'Ngày tạo',
      getCellValue: (row: Playlist) =>
        dayjs(row.createdAt).format('DD/MM/YYYY'),
      filteringEnabled: false
    }
  ];

  const actions: Action[] = [
    {
      icon: <EditIcon htmlColor="blue" sx={{ cursor: 'pointer' }} />,
      onClick: (playlist: Playlist) => editSong(playlist.playlistId)
    },
    {
      icon: <DeleteOutlineIcon htmlColor="red" sx={{ cursor: 'pointer' }} />,
      onClick: (playlist: Playlist) => deleteSong(playlist.playlistId)
    }
  ];
  const tableColumnExtensions = [
    { columnName: 'coverImageUrl', width: 150 },
    { columnName: 'createdAt', width: 150 },
    { columnName: 'action', width: 150 }
  ];
  const getListGenre = useCallback(
    _.debounce((f: Filter[], p, cp) => {
      apiCall({
        url: '/getListPlaylist',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT,
        params: {
          page: cp + 1,
          rowperpage: p,
          keyword: f?.find((e) => e.columnName === 'name')?.value
        }
      }).then((response) => {
        setPlaylist(response.data.listData);
        setTotalCount(response.data.totalRes);
      });
    }, 500),
    []
  );

  useEffect(() => {
    getListGenre(filters ?? [], pageSize, currentPage);
  }, [filters, pageSize, currentPage]);

  const editSong = (id: number) => {
    console.log(id);
  };

  const deleteSong = (id: number) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có chắc là muốn xoá playlist này?`,
      showCancelButton: true,
      didClose: function () {
        return;
      },
      preConfirm: function () {
        apiCall({
          url: '/deletePlaylist',
          method: 'delete',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            id
          }
        }).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Bạn đã xoá playlist này thành công!',
              preConfirm: function () {
                getListGenre(filters ?? [], pageSize, currentPage);
              }
            });
          }
        });
      }
    });
  };

  return (
    <Table
      rows={playlist}
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

export default ManagePlaylistPage;
