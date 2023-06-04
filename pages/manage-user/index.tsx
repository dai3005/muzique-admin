import { Filter } from '@devexpress/dx-react-grid';
import { Button } from '@mui/material';
import Table, { Col, Action } from '@muzique/components/pages/CustomTable';
import OtherModal from '@muzique/components/pages/OtherModal';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { getFile } from '@muzique/helper/helper';
import { User } from '@muzique/models/User';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UserModal from '@muzique/components/pages/UserModal';

const ManageUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [filters, setFilters] = useState<Filter[]>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [userDetail, setUserDetail] = useState<User>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setUserDetail(undefined);
    setOpen(false);
  };

  const cols: Col[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: User) => {
        let image = getFile(row.coverImageUrl);
        return (
          <img
            width={100}
            height={100}
            style={{ borderRadius: '3px', objectFit: 'contain' }}
            src={`${image}`}
            alt="User"
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
      getCellValue: (row: User) => dayjs(row.createdAt).format('DD/MM/YYYY'),
      filteringEnabled: false
    }
  ];

  const actions: Action[] = [
    {
      icon: <EditIcon htmlColor="blue" sx={{ cursor: 'pointer' }} />,
      onClick: (user: User) => editUser(user.userId)
    },
    {
      icon: <DeleteOutlineIcon htmlColor="red" sx={{ cursor: 'pointer' }} />,
      onClick: (user: User) => deleteUser(user.userId)
    }
  ];
  const tableColumnExtensions = [
    { columnName: 'coverImageUrl', width: 150 },
    { columnName: 'createdAt', width: 150 },
    { columnName: 'action', width: 150 }
  ];
  const getListUser = useCallback(
    _.debounce((f: Filter[], p, cp) => {
      apiCall({
        url: '/api/ManageUser/getListUser',
        method: 'get',
        headers: HEADER.HEADER_DEFAULT,
        params: {
          page: cp + 1,
          rowperpage: p,
          keyword: f?.find((e) => e.columnName === 'name')?.value
        }
      }).then((response) => {
        setUsers(response.data.listData);
        setTotalCount(response.data.totalRes);
      });
    }, 500),
    []
  );
  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize]);
  useEffect(() => {
    getListUser(filters ?? [], pageSize, currentPage);
  }, [filters, pageSize, currentPage]);

  const editUser = (id: number) => {
    apiCall({
      url: '/api/ManageUser/getUserById',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        id
      }
    }).then((response) => {
      setUserDetail(response.data);
      setOpen(true);
    });
  };

  const deleteUser = (id: number) => {
    Swal.fire({
      icon: 'question',
      title: `Bạn có chắc là muốn xoá thể loại này?`,
      showCancelButton: true,
      didClose: function () {
        return;
      },
      preConfirm: function () {
        apiCall({
          url: '/deleteGenre',
          method: 'delete',
          headers: HEADER.HEADER_DEFAULT,
          params: {
            id
          }
        }).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Bạn đã xoá thể loại này thành công!',
              preConfirm: function () {
                getListUser(filters ?? [], pageSize, currentPage);
              }
            });
          }
        });
      }
    });
  };

  return (
    <>
      <Table
        rows={users}
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
      <UserModal
        key={userDetail?.userId ?? 'createUserModal' + Date.now()}
        detail={userDetail}
        open={open}
        handleClose={handleClose}
        reloadPage={() => {
          getListUser(filters ?? [], pageSize, currentPage);
        }}
      />
    </>
  );
};

export default ManageUserPage;
