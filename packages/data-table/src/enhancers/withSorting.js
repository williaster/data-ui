import { compose, mapProps, withState, withHandlers } from 'recompose';
import { SortDirection } from 'react-virtualized';

const withSorting = compose(
  withState(
    'sortState',
    'updateSortState',
    ({ dataList }) => ({
      unsortedDataList: dataList,
      sortBy: null,
      sortDirection: null,
      dataList,
    }),
  ),

  withHandlers({
    sort: ({ updateSortState }) => ({ sortBy, sortDirection }) => {
      updateSortState(({ unsortedDataList, sortBy: prevSortBy, sortDirection: prevSortDirection }) => {
        const nextState = { unsortedDataList, sortBy, sortDirection, dataList: unsortedDataList };

        if (sortBy === prevSortBy && prevSortDirection === SortDirection.DESC) {
          delete nextState.sortBy;
          delete nextState.sortDirection;
        } else {
          nextState.dataList = unsortedDataList
            .sortBy(datum => datum[sortBy])
            .update(list => (sortDirection === SortDirection.DESC ? list.reverse() : list));
        }

        return nextState;
      });
    },
  }),

  mapProps(({ sort, sortState, ...rest }) => {
    const { sortBy, sortDirection, dataList } = sortState;
    return {
      ...rest,
      dataList,
      sort,
      sortBy,
      sortDirection,
    };
  }),
);

export default withSorting;
