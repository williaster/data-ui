import PropTypes from 'prop-types';
import React from 'react';

import Props from './Props';
import codeStyles from './codeStyles';
import { css } from '../../../themes/withStyles';

const unit = 8;
const LEFT_WIDTH = unit * 3;

const propTypes = {
  node: PropTypes.node.isRequired,
  depth: PropTypes.number,
  useHOC: PropTypes.bool,
};

const defaultProps = {
  depth: 0,
  useHOC: false,
};

function getWrappedName(name) {
  // If it's an HOC, we want the wrapped component name:
  if (name.includes('(')) {
    return name.slice(name.lastIndexOf('(') + 1, name.indexOf(')'));
  }
  return name;
}

function getData(element, useHOC) {
  const data = {
    name: null,
    text: null,
    children: null,
  };

  if (typeof element === 'string') {
    return { ...data, text: element };
  }

  data.children = element.props.children;

  if (typeof element.type === 'string') {
    return {
      ...data,
      name: element.type,
    };
  }

  const name = element.type.displayName || element.type.name || 'Component';

  return {
    ...data,
    name: useHOC ? name : getWrappedName(name),
  };
}

export default function Node({ node, depth, useHOC }) {
  const { name, text, children } = getData(node, useHOC);

  const indentStyles = {
    paddingLeft: depth * LEFT_WIDTH,
    paddingRight: 8,
  };

  // Just text
  if (!name) {
    return (
      <div {...css(indentStyles)}>
        <span {...css(codeStyles.content)}>{text}</span>
      </div>
    );
  }

  // Single-line tag
  if (!children) {
    return (
      <div {...css(indentStyles)}>
        <span {...css(codeStyles.brace)}>{'<'}</span>
        <span {...css(codeStyles.component)}>{name}</span>
        <Props node={node} singleLine />
        <span {...css(codeStyles.brace)}>{'/>'}</span>
      </div>
    );
  }

  return (
    <div>
      <div {...css(indentStyles)}>
        <span {...css(codeStyles.brace)}>{'<'}</span>
        <span {...css(codeStyles.component)}>{name}</span>
        <Props node={node} />
        <span {...css(codeStyles.brace)}>{'>'}</span>
      </div>
      {React.Children.map(children, (childElement, i) => (
        <Node key={`${name}-${i}`} node={childElement} depth={depth + 1} />
      ))}
      <div {...css(indentStyles)}>
        <span {...css(codeStyles.brace)}>{'</'}</span>
        <span {...css(codeStyles.component)}>{name}</span>
        <span {...css(codeStyles.brace)}>{'>'}</span>
      </div>
    </div>
  );
}

Node.propTypes = propTypes;
Node.defaultProps = defaultProps;
