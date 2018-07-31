import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';

import { linkShape } from '../utils/propShapes';

const propTypes = {
  links: PropTypes.arrayOf(linkShape).isRequired,
  linkComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

export default function Links({ links, linkComponent, className, ...rest }) {
  return (
    <Group>
      {links.map(link => (
        <Group className={cx('data-ui-links', className)} key={`network-link-${link.id}`}>
          {React.createElement(linkComponent, { link, ...rest })}
        </Group>
      ))}
    </Group>
  );
}

Links.propTypes = propTypes;
Links.defaultProps = defaultProps;
