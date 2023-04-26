import {
  DataTypeProvider,
  DataTypeProviderProps
} from '@devexpress/dx-react-grid';
import dayjs from 'dayjs';

const availableFilterOperations: string[] = [
  'equal',
  'notEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual'
];

export const DateProvider: React.ComponentType<DataTypeProviderProps> = (
  props: DataTypeProviderProps
) => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    availableFilterOperations={availableFilterOperations}
    {...props}
  />
);

export const DateFormatter = ({
  value
}: DataTypeProvider.ValueFormatterProps) => (
  <div>{dayjs(value).format('DD/MM/YYYY')}</div>
);
