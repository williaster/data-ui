import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withScreenSize } from '@data-ui/xy-chart';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import WithToggle from '../shared/WithToggle';

const GRID_MARGINS = [16, 16];
const GRID_PADDING = [24, 24];
const COLUMN_COUNT = 24;
const ROW_HEIGHT = 16;

function Container({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 40,
        height: '100%',
        background: '#fff',
      }}
    >
      {children}
    </div>
  );
}

Container.width = COLUMN_COUNT;
Container.height = 2;

function Tabs({
  tabs = ['a', 'b', 'c'],
  tabIndex = 0,
  onClickTab = (i) => { console.log('tab', i); },
}) {
  return (
    <div
      style={{
        position: 'relative',
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
  );
}

Tabs.width = COLUMN_COUNT;
Tabs.height = 2;
Tabs.static = true;


function Separator() {
  return (
    <div
      style={{
        position: 'relative',
        height: 2,
        background: '#ccc',
        width: '100%',
        margin: '8px 0',
      }}
    />
  );
}

Separator.width = COLUMN_COUNT;
Separator.height = 1;
Separator.static = true;


function Header({ children = 'My header text' }) {
  return <div style={{ position: 'relative' }}><h4>{children}</h4></div>;
}

Header.width = COLUMN_COUNT;
Header.height = 2;
Header.static = true;

function Chart() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'skyblue',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
      }}
    >
      📈
    </div>
  );
}

Chart.width = 3;
Chart.height = 6;
Chart.minW = 2;
Chart.minH = 2;

const COMPONENT_LOOKUP = {
  Chart,
  Header,
  Separator,
  Tabs,
  Container,
};

function configFromComponent(Component) {
  return {
    type: Component.name,
    w: Component.width,
    h: Component.height,
    minW: Component.minW,
    minH: Component.minH,
    isResizable: !Component.static,
    isDraggable: true,
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: [
        { ...configFromComponent(Header), i: '0', x: 0, y: 0 },
        { ...configFromComponent(Tabs), i: '1', x: 0, y: 1 },
        { ...configFromComponent(Chart), i: '2', x: 0, y: 2 },
        { ...configFromComponent(Chart), i: '3', x: Chart.width, y: 3 },
        { ...configFromComponent(Separator), i: '4', x: 0, y: 4 },
        { ...configFromComponent(Header), i: '5', x: 0, y: 5 },
        { ...configFromComponent(Container), i: '6', x: 0, y: 6 },
      ],
    };
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  handleDragStart() {
    console.log('start', arguments)
  }

  handleDragEnd() {
    console.log('end', arguments)
  }

  handleLayoutChange(nextLayout) {
    console.log('nextLayout', nextLayout);
    // this.setState(() => ({ layout: nextLayout || [] }));
  }

  addComponentToGrid(component, parentComponent) {

  }

  render() {
    const { screenHeight, screenWidth } = this.props;
    const width = Math.max(200, screenWidth - 50);
    const height = Math.max(500, screenHeight - 20);
    return (
      <DragDropContext
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      >
        <div
          style={{
            fontSize: 14,
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
            height,
            width,
          }}
        >
          <div
            style={{
              flexBasis: '70%',
              flexShrink: 0,
              flexGrow: 1,
              height: '100%',
              position: 'relative',
            }}
          >
            <WithToggle id="grid_edit_toggle" label="Edit mode" initialChecked>
              {editableGrid => (
                <Droppable droppableId="grid">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={{
                        position: 'relative',
                        backgroundColor: snapshot.isDraggingOver ? '#ddd' : 'white',
                        height: '100%',
                      }}
                    >
                      {provided.placeholder}

                      <ReactGridLayout
                        width={0.7 * width}
                        cols={COLUMN_COUNT}
                        rowHeight={ROW_HEIGHT}
                        margin={GRID_MARGINS}
                        containerPadding={GRID_PADDING}
                        onDragStop={() => { console.log('drag stop', arguments); }}
                        onLayoutChange={this.handleLayoutChange}
                        isResizable={editableGrid}
                        isDraggable={editableGrid}
                        layout={this.state.layout}
                        useCSSTransforms
                        autoSize
                      >
                        {this.state.layout.map(item => (
                          console.log(item) ||
                          <div key={item.i}>
                            {React.createElement(COMPONENT_LOOKUP[item.type])}
                          </div>
                        ))}
                      </ReactGridLayout>
                    </div>
                  )}
                </Droppable>
              )}
            </WithToggle>
          </div>

          <div
            style={{
              height: '100%',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              flexBasis: '30%',
              flexShrink: 0,
              flexGrow: 1,
              background: '#eaeaea',
            }}
          >
            <Droppable droppableId="components">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                >
                  {provided.placeholder}
                  {[Chart, Tabs, Container, Separator, Header].map(Component => (
                    <div style={{ padding: 8 }} key={Component.name}>
                      <strong style={{ textTransform: 'uppercase' }}>{Component.name}</strong>
                      <br />
                      <Draggable draggableId={`draggable-${Component.name}`}>
                        {(providedDrag, snapshotDrag) => (
                          <div>
                            <div
                              ref={providedDrag.innerRef}
                              style={providedDrag.draggableStyle}
                              {...providedDrag.dragHandleProps}
                            >
                              <Component />
                            </div>
                            {providedDrag.placeholder}
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}

                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    );
  }
}

export default withScreenSize(App);
