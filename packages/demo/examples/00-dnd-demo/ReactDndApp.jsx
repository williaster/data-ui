import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withScreenSize } from '@data-ui/xy-chart';

import Checkbox from '../shared/Checkbox';
import Chart from './components/Chart';
import Container from './components/Container';
import Header from './components/Header';
import Separator from './components/Separator';
import Spacer from './components/Spacer';
import Tabs from './components/Tabs';

import Resizable from './components/Resizable';

import { reorder, reorderRows } from './reorder';

const COMPONENT_LOOKUP = {
  Chart,
  Header,
  Separator,
  Tabs,
  Container,
  Spacer,
};

const NEW_PREFIX = 'new-';
const GRID_ID = 'GRID_ID';
const ROW_TYPE = 'ROW_TYPE';
const VERTICAL_DIRECTION = 'vertical';
const HORIZONTAL_DIRECTION = 'horizontal';

// utils
const newRegex = RegExp(`^${NEW_PREFIX}(.*)`);
const isNewEntity = id => newRegex.test(id);
const isRowType = type => type === Container.name || type === Tabs.name;
const getUuid = () => `${Math.random().toString(36)}00000000000000000`.slice(2, 7);
const getNewType = (id) => {
  const match = id.match(newRegex);
  return match && match[1];
};

const pageStyles = {
  fontSize: 14,
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  background: '#efefef',
};

const gridStyles = {
  flexBasis: '70%',
  flexShrink: 0,
  flexGrow: 1,
  height: '100%',
  position: 'relative',
};

const rowStyles = {
  // margin: 24,
  position: 'relative',
};

const itemStyles = {
  position: 'relative',
  margin: '16px 0',
};

const sidePanelStyles = {
  height: '100%',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  flexBasis: '30%',
  borderLeft: '1px solid #e0e0e0',
};

const deleteItemStyles = {
  position: 'absolute',
  top: 4,
  right: 4,
  zIndex: 1,
  color: '#484848',
  cursor: 'pointer',
  width: 15,
  height: 15,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: true,
      rows: [],
      entities: {},
    };

    this.handleDeleteEntity = this.handleDeleteEntity.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleToggleEditMode = this.handleToggleEditMode.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  handleDeleteEntity(id) {
    this.setState(({ rows, entities }) => {
      let nextRows = rows;
      const nextEntities = { ...entities };

      // delete the entity
      delete nextEntities[id];

      if (isRowType(entities[id].type)) {
        // remove the row if it's a row
        nextRows = rows.filter(rowId => rowId !== id);
      } else {
        // remove the entity from the appropriate row if it's not a row itself
        const rowId = rows.filter(rowId => entities[rowId].children.indexOf(id) > -1)[0];
        if (rowId) {
          const row = entities[rowId];
          nextEntities[rowId] = {
            ...row,
            children: row.children.filter(rowId => rowId !== id),
          };
        }
      }

      return { rows: nextRows, entities: nextEntities };
    });
  }

  handleNewEntity({ draggableId, destination }) {
    this.setState(({ rows, entities }) => {
      const nextEntities = { ...entities };
      let nextRows = [...rows];

      const id = getUuid();
      const type = getNewType(draggableId);
      const isRow = isRowType(type);
      const needsContainer = !isRow && destination.droppableId === GRID_ID;

      nextEntities[id] = {
        id,
        type,
        props: {},
        children: isRow ? [] : null,
        direction: isRow ? HORIZONTAL_DIRECTION : null,
      };

      if (needsContainer) {
        const containerId = getUuid();
        nextEntities[containerId] = {
          id: containerId,
          type: Container.name,
          children: [id],
          direction: HORIZONTAL_DIRECTION,
        };
        nextRows = [
          ...rows.slice(0, destination.index),
          containerId,
          ...rows.slice(destination.index),
        ];
      } else if (destination.droppableId === GRID_ID) {
        nextRows = [
          ...rows.slice(0, destination.index),
          id,
          ...rows.slice(destination.index),
        ];
      } else {
        const target = nextEntities[destination.droppableId];
        nextEntities[destination.droppableId] = {
          ...target,
          children: [
            ...target.children.slice(0, destination.index),
            id,
            ...target.children.slice(destination.index),
          ],
        };
      }

      return { entities: nextEntities, rows: nextRows };
    });
  }

  handleReorder({ source, destination, draggableId }) {
    this.setState(({ rows, entities }) => {
      const { type } = entities[draggableId];

      if (isRowType(type)) { // re-ordering rows
        const nextRows = reorder(
          rows,
          source.index,
          destination.index,
        );
        return { rows: nextRows };
      }

      // moving items between rows
      const nextEntities = reorderRows({
        entitiesMap: entities,
        source,
        destination,
      });

      return { entities: nextEntities };
    });
  }

  handleDragEnd(dropResult) {
    if (!dropResult.destination) return;
    else if (isNewEntity(dropResult.draggableId)) this.handleNewEntity(dropResult);
    else this.handleReorder(dropResult);
  }

  handleDragStart({ draggableId }) {}

  handleToggleEditMode() {
    this.setState(({ editMode }) => ({ editMode: !editMode }));
  }

  handleResizeStart(id) {
    this.setState(() => ({ resizeId: id }));
  }

  handleResizeStop() {
    this.setState(() => ({ resizeId: null }));
  }

  hanldeToggleRowDirection(id) {
    console.log(this.state.entities[id]);
    this.setState(({ entities }) => ({
      entities: {
        ...entities,
        [id]: {
          ...entities[id],
          direction: entities[id].direction === VERTICAL_DIRECTION
            ? HORIZONTAL_DIRECTION : VERTICAL_DIRECTION,
        }
      },
    }));
  }

  renderCheckbox() {
    return (
      <Checkbox
        id="dnd_edit_mode_toggle"
        label="Edit mode"
        checked={this.state.editMode}
        onChange={this.handleToggleEditMode}
      />
    );
  }

  renderSidePanel() {
    return !this.state.editMode ? null : (
      <div style={sidePanelStyles}>
        {[Tabs, Container, Header, Chart, Separator, Spacer].map(Component => (
          <Droppable
            droppableId={`${NEW_PREFIX}${Component.name}`}
            isDropDisabled
            type={isRowType(Component.name) ? ROW_TYPE : 'DEFAULT'}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
              >
                {provided.placeholder}
                <div style={{ padding: 8 }} key={Component.name}>
                  <strong style={{ textTransform: 'uppercase' }}>{Component.name}</strong>
                  <br />
                  <Draggable
                    draggableId={`${NEW_PREFIX}${Component.name}`}
                    isDragDisabled={!this.state.editMode}
                    type={isRowType(Component.name) ? ROW_TYPE : 'DEFAULT'}
                  >
                    {(providedDrag, snapshotDrag) => (
                      <div>
                        <div
                          ref={providedDrag.innerRef}
                          style={{
                            ...providedDrag.draggableStyle,
                            cursor: this.state.editMode ? 'move' : 'initial',
                          }}
                          {...providedDrag.dragHandleProps}
                        >
                          <Component editMode={this.state.editMode} />
                        </div>
                        {providedDrag.placeholder}
                      </div>
                    )}
                  </Draggable>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    );
  }

  renderGrid() {
    return (
      <div style={gridStyles}>
        <Droppable
          droppableId={GRID_ID}
          direction="vertical"
          type={ROW_TYPE}
          isDragDisabled={!this.state.editMode}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                position: 'relative',
                backgroundColor: snapshot.isDraggingOver ? '#e0e0e0' : null,
                minHeight: 100,
                height: '100%',
              }}
            >
              {this.state.rows.map(id => this.renderRow(id))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }

  renderRow(id) {
    const { type, props, children, direction, margins } = this.state.entities[id];
    const Component = COMPONENT_LOOKUP[type];

    return (
      <Draggable
        key={id}
        draggableId={id}
        type={ROW_TYPE}
        isDragDisabled={!this.state.editMode}
      >
        {(provided, snapshot) => (
          <div style={{ ...rowStyles, margin: margins ? '0 24px 24px 0' : null }}>
            <div
              ref={provided.innerRef}
              style={{
                ...provided.draggableStyle,
                cursor: this.state.editMode ? 'move' : 'initial',
                minHeight: 32,
              }}
              {...provided.dragHandleProps}
            >
              <Droppable
                droppableId={id}
                direction={direction}
                isDragDisabled={!this.state.editMode}
              >
                {(providedDrop, snapshotDrop) => (
                  <div
                    ref={providedDrop.innerRef}
                    style={{
                      position: 'relative',
                      backgroundColor: snapshotDrop.isDraggingOver ? '#e0e0e0' : null,
                    }}
                  >
                    {this.state.editMode &&
                      <div
                        onClick={() => { this.handleDeleteEntity(id); }}
                        style={deleteItemStyles}
                      >
                        x
                      </div>}
                    {this.state.editMode &&
                      <div style={{ position: 'absolute', top: 0, zIndex: 1 }}>
                        <Checkbox
                          id={`${id}_direction_toggle`}
                          label="Row orientation"
                          checked={direction === VERTICAL_DIRECTION}
                          onChange={(e) => {
                            this.hanldeToggleRowDirection(id);
                          }}
                        />
                      </div>}

                    <Component {...props} editMode={this.state.editMode} direction={direction}>
                      {children.map(childId => this.renderRowItem(childId))}
                      {providedDrop.placeholder}
                    </Component>
                  </div>
                )}
              </Droppable>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }

  renderRowItem(id) {
    const { type, props } = this.state.entities[id];
    const Component = COMPONENT_LOOKUP[type];
    const isResizable = type === Chart.name || type === Spacer.name;
    return (
      <Draggable
        key={id}
        draggableId={id}
        isDragDisabled={!this.state.editMode || this.state.resizeId === id}
      >
        {(provided, snapshot) => (
          <div style={itemStyles}>
            {this.state.editMode &&
              <div
                onClick={() => { this.handleDeleteEntity(id); }}
                style={deleteItemStyles}
              >
                x
              </div>}
            <div
              ref={provided.innerRef}
              style={{
                ...provided.draggableStyle,
                cursor: this.state.editMode ? 'move' : 'initial',
              }}
              {...provided.dragHandleProps}
            >
              {isResizable ?
                <Resizable
                  onResizeStart={() => { this.handleResizeStart(id); }}
                  onResizeStop={() => { this.handleResizeStop(id); }}
                >
                  <Component {...props} editMode={this.state.editMode} />
                </Resizable>
                : <Component {...props} editMode={this.state.editMode} />
              }

            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }

  render() {
    const { screenHeight, screenWidth } = this.props;
    const width = Math.max(200, screenWidth - 50);
    const height = Math.max(500, screenHeight - 20);

    return (
      <DragDropContext
        onDragEnd={this.handleDragEnd}
        onDragStart={this.handleDragStart}
      >
        {this.renderCheckbox()}
        <div style={{ height, ...pageStyles }}>
          {this.renderGrid()}
          {this.renderSidePanel()}
        </div>
      </DragDropContext>
    );
  }
}

export default withScreenSize(App);
