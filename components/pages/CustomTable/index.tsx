import React from 'react';
import Paper from '@mui/material/Paper';
import {
  Column,
  FilteringState,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  Filter,
  CustomPaging
} from '@devexpress/dx-react-grid';
import {
  DragDropProvider,
  Grid,
  PagingPanel,
  Table,
  TableFilterRow,
  TableHeaderRow,
  TableSelection,
  Toolbar
} from '@devexpress/dx-react-grid-material-ui';

import { FC } from 'react';
import { Stack } from '@mui/material';

export type Col = Column & { filteringEnabled?: boolean };
export type Action = {
  icon: JSX.Element;
  onClick: (element: any) => void;
};
type Props = {
  rows: any[];
  filters?: Filter[];
  onFiltersChange?: (filters: Filter[]) => void;
  pageSizes?: number[];
  pageSize?: number;
  setPageSize: (pageSize: number) => void;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  cols: Col[];
  actions: Action[];
  tableColumnExtensions: Table.ColumnExtension[];
};

const CustomTable: FC<Props> = ({
  rows,
  filters,
  onFiltersChange,
  pageSizes = [2, 5, 10, 15, 0],
  pageSize,
  totalCount,
  setPageSize,
  currentPage,
  setCurrentPage,
  cols,
  actions,
  tableColumnExtensions,
  ...props
}) => {
  const column: Col[] = [
    ...cols,
    {
      name: 'action',
      title: 'Thao tác',
      filteringEnabled: false,
      getCellValue: (row: any) => {
        return (
          <Stack direction={'row'} spacing={'20px'} paddingLeft={'15px'}>
            {actions.map((e, index) => (
              <div key={index} onClick={() => e.onClick(row)}>
                {e.icon}
              </div>
            ))}
          </Stack>
        );
      }
    }
  ];

  const columns: Column[] = column.map((c) => {
    const { filteringEnabled, ...col } = c;
    return col;
  });
  const filteringStateColumnExtensions: FilteringState.ColumnExtension[] =
    column.map((c) => ({
      columnName: c.name,
      filteringEnabled:
        c.filteringEnabled !== undefined ? c.filteringEnabled : true
    }));

  return (
    <Paper
      sx={{
        '& .PageSizeSelector-pageSizeSelector': {
          pr: '0px !important'
        },
        '& .Pagination-rowsLabel': {
          display: 'none'
        }
      }}
    >
      <Grid rows={rows} columns={columns}>
        <FilteringState
          filters={filters}
          onFiltersChange={onFiltersChange}
          columnExtensions={filteringStateColumnExtensions}
        />
        <SortingState />
        <SelectionState />
        <PagingState
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
        />
        <CustomPaging totalCount={totalCount} />
        <IntegratedSorting />
        {/* <IntegratedPaging /> */}
        <IntegratedSelection />
        {/* <DateProvider for={['createdAt', 'updatedAt']} /> */}
        <DragDropProvider />

        <Table columnExtensions={tableColumnExtensions} />
        <TableSelection showSelectAll={true} />

        <TableHeaderRow showSortingControls={true} />
        <TableFilterRow showFilterSelector={true} />
        <PagingPanel pageSizes={pageSizes} messages={{ info: () => '' }} />

        <Toolbar />
      </Grid>
    </Paper>
  );
};

export default CustomTable;
