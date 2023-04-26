import React from 'react';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import {
  Column,
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
  DataTypeProviderProps,
  Filter
} from '@devexpress/dx-react-grid';
import {
  DragDropProvider,
  Grid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  Toolbar
} from '@devexpress/dx-react-grid-material-ui';

import { FC, useState } from 'react';
import { Song } from '@muzique/models/Song';
import { DateProvider } from './helpers';
import dayjs from 'dayjs';
import { RemoveVietnameseTones, getFile } from '@muzique/helper/helper';

type Props = {
  rows: Song[];
  filters?: Filter[];
  onFiltersChange?: (filters: Filter[]) => void;
};

const SongTable: FC<Props> = ({ rows, filters, onFiltersChange, ...props }) => {
  const [pageSizes] = useState<number[]>([5, 10, 15]);

  const cols: (Column & { filteringEnabled?: boolean })[] = [
    {
      name: 'coverImageUrl',
      title: 'Ảnh',
      getCellValue: (row: Song) => {
        let image = getFile(row.coverImageUrl);
        return <img width={100} height={100} src={`${image}`} alt="song" />;
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

  const columns: Column[] = cols.map((c) => {
    const { filteringEnabled, ...col } = c;
    return col;
  });

  const filteringStateColumnExtensions: FilteringState.ColumnExtension[] =
    cols.map((c) => ({
      columnName: c.name,
      filteringEnabled:
        c.filteringEnabled !== undefined ? c.filteringEnabled : true
    }));

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <FilteringState
          filters={filters}
          onFiltersChange={onFiltersChange}
          columnExtensions={filteringStateColumnExtensions}
        />
        <SortingState
          defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
        />

        <SelectionState />
        <PagingState />
        <IntegratedSorting />
        <IntegratedPaging />
        <IntegratedSelection />
        {/* <DateProvider for={['createdAt', 'updatedAt']} /> */}
        <DragDropProvider />

        <Table />
        <TableSelection showSelectAll={true} />

        <TableHeaderRow showSortingControls={true} />
        <TableFilterRow showFilterSelector={true} />
        <PagingPanel pageSizes={pageSizes} />

        <Toolbar />
      </Grid>
    </Paper>
  );
};

export default SongTable;
