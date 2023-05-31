import { Filter } from '@devexpress/dx-react-grid';
import Table, { Col, Action } from '@muzique/components/pages/CustomTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { Album } from '@muzique/models/Album';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AlbumModal from '@muzique/components/pages/AlbumModal';
import { Button } from '@mui/material';

const ManageAlbumPage = () => {
  const [album, setAlbum] = useState<Album[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [albumDetail, setAlbumDetail] = useState<Album>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setAlbumDetail(undefined);
    setOpen(false);
  };

  const cols: Col[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: Album) => {
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
      getCellValue: (row: Album) => dayjs(row.createdAt).format('DD/MM/YYYY'),
      filteringEnabled: false
    }
  ];

  const actions: Action[] = [
    {
      icon: <EditIcon htmlColor="blue" sx={{ cursor: 'pointer' }} />,
      onClick: (album: Album) => editAlbum(album.albumId)
    },
    {
      icon: <DeleteOutlineIcon htmlColor="red" sx={{ cursor: 'pointer' }} />,
      onClick: (album: Album) => deleteAlbum(album.albumId)
    }
  ];
  const tableColumnExtensions = [
    { columnName: 'coverImageUrl', width: 150 },
    { columnName: 'createdAt', width: 150 },
    { columnName: 'action', width: 150 }
  ];
  const getListAlbum = useCallback(
    _.debounce((f: Filter[], p, cp) => {
      apiCall({
        url: '/getListAlbum',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT,
        params: {
          page: cp + 1,
          rowperpage: p,
          keyword: f?.find((e) => e.columnName === 'name')?.value
        }
      }).then((response) => {
        setAlbum(response.data.listData);
        setTotalCount(response.data.totalRes);
      });
    }, 500),
    []
  );

  useEffect(() => {
    getListAlbum(filters ?? [], pageSize, currentPage);
  }, [filters, pageSize, currentPage]);

  const editAlbum = (id: number) => {
    apiCall({
      url: '/getAlbumDetail',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        id
      }
    }).then((response) => {
      setAlbumDetail(response.data);
      setOpen(true);
    });
  };

  const deleteAlbum = (id: number) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có chắc là muốn xoá album này?`,
      showCancelButton: true,
      didClose: function () {
        return;
      },
      preConfirm: function () {
        apiCall({
          url: '/deleteAlbum',
          method: 'delete',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            id
          }
        }).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Bạn đã xoá album này thành công!',
              preConfirm: function () {
                getListAlbum(filters ?? [], pageSize, currentPage);
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
        Tạo album mới
      </Button>
      <Table
        rows={album}
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
      <AlbumModal
        key={albumDetail?.albumId ?? 'createAlbumModal'}
        album={albumDetail}
        open={open}
        handleClose={handleClose}
        reloadPage={() => {
          getListAlbum(filters ?? [], pageSize, currentPage);
        }}
      />
    </>
  );
};

export default ManageAlbumPage;
