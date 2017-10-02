/* eslint import/no-extraneous-dependencies: 0 */
import 'babel-polyfill'; // eslint-disable-line import/no-extraneous-dependencies
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
