import theme from '../../themes/DefaultTheme';

const { color, font } = theme;

const tableStyles = {
  table: {
    ...font.regular,
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...font.regular,
    ...font.bold,
  },

  row: ({ index }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...font.regular,
    ...font.light,
    background: index % 2 === 0 ? color.lightGray : null,
  }),
};

const sorableTableStyles = {
  ...tableStyles,

  header: {
    ...tableStyles.header,
    cursor: 'pointer',
  },
};

export { tableStyles, sorableTableStyles };
