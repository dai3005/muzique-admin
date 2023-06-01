import { Filter } from '@devexpress/dx-react-grid';
import Table, { Col, Action } from '@muzique/components/pages/CustomTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { Artist } from '@muzique/models/Artist';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '@mui/material';
import OtherModal from '@muzique/components/pages/OtherModal';

const ManageArtistPage = () => {
  const [artist, setArtist] = useState<Artist[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [artistDetail, setArtistDetail] = useState<Artist>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setArtistDetail(undefined);
    setOpen(false);
  };

  const cols: Col[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: Artist) => {
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
    { name: 'name', title: 'Tên ca sĩ' },
    { name: 'description', title: 'Mô tả', filteringEnabled: false },
    {
      name: 'createdAt',
      title: 'Ngày tạo',
      getCellValue: (row: Artist) => dayjs(row.createdAt).format('DD/MM/YYYY'),
      filteringEnabled: false
    }
  ];

  const actions: Action[] = [
    {
      icon: <EditIcon htmlColor="blue" sx={{ cursor: 'pointer' }} />,
      onClick: (artist: Artist) => editArtist(artist.artistId)
    },
    {
      icon: <DeleteOutlineIcon htmlColor="red" sx={{ cursor: 'pointer' }} />,
      onClick: (artist: Artist) => deleteArtist(artist.artistId)
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
        url: '/getListArtist',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT,
        params: {
          page: cp + 1,
          rowperpage: p,
          keyword: f?.find((e) => e.columnName === 'name')?.value
        }
      }).then((response) => {
        setArtist(response.data.listData);
        setTotalCount(response.data.totalRes);
      });
    }, 500),
    []
  );

  useEffect(() => {
    getListGenre(filters ?? [], pageSize, currentPage);
  }, [filters, pageSize, currentPage]);

  const editArtist = (id: number) => {
    apiCall({
      url: '/getArtistDetail',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        id
      }
    }).then((response) => {
      setArtistDetail(response.data);
      setOpen(true);
    });
  };

  const deleteArtist = (id: number) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có chắc là muốn xoá ca sĩ này?`,
      showCancelButton: true,
      didClose: function () {
        return;
      },
      preConfirm: function () {
        apiCall({
          url: '/deleteArtist',
          method: 'delete',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            id
          }
        }).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Bạn đã xoá ca sĩ này thành công!',
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
    <>
      <Button
        variant="contained"
        sx={{ margin: '20px' }}
        onClick={() => setOpen(true)}
      >
        Tạo ca sĩ mới
      </Button>
      <Table
        rows={artist}
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
      <OtherModal
        key={artistDetail?.artistId ?? 'createArtistModal'}
        detail={artistDetail}
        open={open}
        handleClose={handleClose}
        reloadPage={() => {
          getListGenre(filters ?? [], pageSize, currentPage);
        }}
        type="artist"
      />
    </>
  );
};

export default ManageArtistPage;
