/* eslint react/prop-types: 0 */
import React from 'react';

import Container from './Container';

export default class Tabs extends React.PureComponent {
  render() {
    const {
      tabs = ['a', 'b', 'c'],
      tabIndex = 0,
      onClickTab = (i) => { console.log('tab', i); },
      children,
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottom: '1px solid #777',
          }}
        >
          {tabs.map((t, i) => (
            <div
              key={t}
              style={{
                borderBottom: i === tabIndex ? '2px solid #777' : null,
                padding: 12,
                background: '#ccc',
              }}
            >
              <button
                style={{ background: 'none', border: 'none' }}
                onClick={() => { onClickTab(i); }}
              >
                {t}
              </button>
            </div>
          ))}
        </div>

        {children &&
          <Container
            editMode={this.props.editMode}
            direction={this.props.direction}
          >
            {children}
          </Container>}
      </div>
    );
  }
}
