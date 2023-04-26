import { Filter } from '@devexpress/dx-react-grid';
import SongTable from '@muzique/components/pages/manage-song/SongTable';
import { HEADER } from '@muzique/constants/header';
import { apiCall } from '@muzique/helper/axios';
import { Song } from '@muzique/models/Song';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ManageSongPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const [filters, setFilters] = useState<Filter[]>();

  useEffect(() => {
    apiCall({
      url: '/getListSong',
      method: 'get',
      headers: HEADER.HEADER_DEFAULT,
      params: {
        page: 1,
        rowperpage: 4,
        keyword: filters?.find((e) => e.columnName === 'name')?.value
      }
    }).then((response) => {
      // console.log(response);
      setSongs(response.data.listSong);
    });
  }, [filters]);

  return (
    <SongTable rows={songs} filters={filters} onFiltersChange={setFilters} />
  );
};

export default ManageSongPage;
