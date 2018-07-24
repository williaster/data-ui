/* eslint import/no-extraneous-dependencies: 0 */
import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// polyfill for React 16 https://github.com/facebook/react/issues/9102#issuecomment-283873039
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};
