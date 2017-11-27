import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withScreenSize } from '@data-ui/xy-chart';

import Checkbox from '../shared/Checkbox';
import Chart from './components/Chart';
import Container from './components/Container';
import Header from './components/Header';
import Separator from './components/Separator';
import Tabs from './components/Tabs';

import { reorder, reorderRows } from './reorder';

const COMPONENT_LOOKUP = {
  Chart,
  Header,
  Separator,
  Tabs,
  Container,
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

const containerStyles = {
  fontSize: 14,
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
};

const gridStyles = {
  flexBasis: '70%',
  flexShrink: 0,
  flexGrow: 1,
  height: '100%',
  position: 'relative',
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
        direction: isRow ? VERTICAL_DIRECTION : null,
      };

      if (needsContainer) {
        const containerId = getUuid();
        nextEntities[containerId] = {
          id: containerId,
          type: Container.name,
          children: [id],
          direction: VERTICAL_DIRECTION,
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
      <div
        style={{
          height: '100%',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '30%',
          background: '#eaeaea',
        }}
      >
        {[Chart, Tabs, Container, Separator, Header].map(Component => (
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
                backgroundColor: snapshot.isDraggingOver ? '#e0e0e0' : '#fff',
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
    const { type, props, children, direction } = this.state.entities[id];
    const Component = COMPONENT_LOOKUP[type];

    return (
      <Draggable
        key={id}
        draggableId={id}
        type={ROW_TYPE}
        isDragDisabled={!this.state.editMode}
      >
        {(provided, snapshot) => (
          <div style={{ position: 'relative' }}>
            <div
              ref={provided.innerRef}
              style={{
                ...provided.draggableStyle,
                cursor: this.state.editMode ? 'move' : 'initial',
                minHeight: 40,
              }}
              {...provided.dragHandleProps}
            >
              <Droppable
                droppableId={id}
                direction={direction}
                isDragDisabled={!this.state.editMode}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      position: 'relative',
                      backgroundColor: snapshot.isDraggingOver ? '#e0e0e0' : '#fff',
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
                            e.preventDefault();
                            this.hanldeToggleRowDirection(id);
                          }}
                        />
                      </div>}
                    <Component {...props} editMode={this.state.editMode} direction={direction}>
                      {children.map(childId => (
                        <div
                          key={childId}
                          style={{
                            padding: 8,
                            width: 'inherit',
                            height: 'inherit',
                            flex: 1,
                          }}
                        >
                          {this.renderRowItem(childId)}
                        </div>
                      ))}
                      {provided.placeholder}
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

    return (
      <Draggable
        key={id}
        draggableId={id}
        isDragDisabled={!this.state.editMode}
      >
        {(provided, snapshot) => (
          <div style={{ position: 'relative' }}>
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
              <Component {...props} editMode={this.state.editMode} />
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
        <div style={{ height, width, ...containerStyles }}>
          {this.renderGrid()}
          {this.renderSidePanel()}
        </div>
      </DragDropContext>
    );
  }
}

export default withScreenSize(App);
