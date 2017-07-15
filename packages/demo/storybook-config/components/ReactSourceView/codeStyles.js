import { StyleSheet } from 'aphrodite';

const codeColors = {
  func: '#f06595',
  attr: '#12b886',
  object: '#65737E',
  array: '#65737E',
  number: '#ff922b',
  string: '#e599f7',
  bool: '#ff922b',
  empty: '#C0C5CE',
  brace: '#862e9c',
  component: '#d6336c',
  prop: '#ae3ec9',
  content: '#24292e',
};

const codeStyles = {};

Object.entries(codeColors).forEach(([type, color]) => {
  codeStyles[type] = { color };
});


export default StyleSheet.create(codeStyles);
