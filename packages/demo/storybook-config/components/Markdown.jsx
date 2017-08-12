/* eslint react/no-danger: 0, react/no-array-index-key: 0 */
import marked from 'marked'; // js parser
import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const highlightCode = (instance) => {
  const domNode = ReactDOM.findDOMNode(instance); // eslint-disable-line react/no-find-dom-node
  const nodes = domNode.querySelectorAll('code');

  if (nodes.length > 0) {
    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].classList.add('language-jsx');
      Prism.highlightElement(nodes[i]);
    }
  }
};

export default class Markdown extends React.Component {
  componentDidMount() {
    highlightCode(this);
  }

  componentDidUpdate() {
    highlightCode(this);
  }

  render() {
    const html = marked(this.props.source);
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <style>{`
          /**
          * prism.js default theme for JavaScript, CSS and HTML
          * Based on dabblet (http://dabblet.com)
          * @author Lea Verou
          */
          code[class*="language-"],
          pre[class*="language-"] {
            color: black;
            background: #efefef;
            font-size: 13px;
            text-shadow: 0 1px white;
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            line-height: 1.5;
            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;
            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
          }
          pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
          code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
            text-shadow: none;
            background: #b3d4fc;
          }
          pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
          code[class*="language-"]::selection, code[class*="language-"] ::selection {
            text-shadow: none;
            background: #b3d4fc;
          }
          @media print {
          code[class*="language-"],
          pre[class*="language-"] {
              text-shadow: none;
            }
          }
          /* Code blocks */
          pre[class*="language-"] {
            padding: 1em;
            margin: .5em 0;
            overflow: auto;
          }
          :not(pre) > code[class*="language-"],
          pre[class*="language-"] {
          background: #efefef;
          }
          /* Inline code */
          :not(pre) > code[class*="language-"] {
            padding: .1em;
            border-radius: .3em;
            white-space: normal;
          }
          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata {
            color: slategray;
          }
          .token.punctuation {
            color: #24292e;
          }
          .tag .token.punctuation {
            color: #d73a49;
          }
          .namespace {
            opacity: .7;
          }
          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #24292e;
          }
          .tag .token.selector,
          .tag .token.attr-name,
          .tag .token.string,
          .tag .token.char,
          .tag .token.builtin,
          .tag .token.inserted {
            color: #4f57a0;
          }
          .token.string {
            color: #005cc5;
          }
          .token.operator,
          .token.entity,
          .token.url,
          .language-css .token.string,
          .style .token.string {
            color: #a67f59;
          }
          .token.atrule,
          .token.attr-value,
          .token.keyword {
            color: #d73a49;
          }
          .token.function {
            color: #6f42c1;
          }
          .token.regex,
          .token.important,
          .token.variable {
            color: #e90;
          }
          .token.important,
          .token.bold {
            font-weight: bold;
          }
          .token.italic {
            font-style: italic;
          }
          .token.entity {
            cursor: help;
          }
        `}</style>
      </div>
    );
  }
}

Markdown.propTypes = {
  source: PropTypes.string,
};

Markdown.defaultProps = {
  source: '',
};
