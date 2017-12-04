import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withScreenSize } from '@data-ui/xy-chart';

import Checkbox from '../shared/Checkbox';

import Chart from './components/Chart';
import Container from './components/Container';
import Header from './components/Header';
import Separator from './components/Separator';
import Tabs from './components/Tabs';

const NEW_PREFIX = 'new-';
const GRID_ID = 'GRID_ID';

const COMPONENT_LOOKUP = {
  Chart,
  Header,
  Separator,
  Tabs,
  Container,
};

// Helpers
const newRegex = RegExp(`^${NEW_PREFIX}(.*)`);
const isNew = id => newRegex.test(id);
const getNewType = (id) => {
  const match = id.match(newRegex);
  return match && match[1];
};
const getUuid = () => `${Math.random().toString(36)}00000000000000000`.slice(2, 7);
const isDroppable = type => type === Container.name || type === Tabs.name;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingId: null,
      editMode: true,
      entities: {
        [GRID_ID]: {
          id: GRID_ID,
          type: Container.name,
          layout: ['header', 'container'],
          props: {},
          droppable: true,
        },

        header: {
          id: 'header',
          type: Header.name,
          layout: [],
          props: {},
        },

        container: {
          id: 'container',
          type: Container.name,
          layout: ['chart'],
          props: {},
          droppable: true,
        },

        chart: {
          id: 'chart',
          type: Chart.name,
          layout: [],
          props: {},
        },
      },
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleToggleEditMode = this.handleToggleEditMode.bind(this);
  }

  handleDragEnd(dropResult) {
    console.log('end', arguments[0]);
    if (!dropResult || !dropResult.destination) {
      return;
    }

    this.setState((state) => {
      const nextEntities = { ...state.entities };
      const { source, destination, draggableId } = dropResult;
      const isNewEntity = isNew(draggableId);

      let entity;
      if (isNewEntity) {
        const type = getNewType(draggableId);
        const id = getUuid();
        entity = { id, type, props: {}, layout: [], droppable: isDroppable(type) };
        nextEntities[id] = entity;
      } else {
        entity = nextEntities[draggableId];
      }

      const { droppableId: sourceId, index: sourceIndex } = source;
      const { droppableId: targetId, index: targetIndex } = destination;

      const sourceEntity = nextEntities[sourceId];
      const targetEntity = nextEntities[targetId];

      if (targetId === sourceId) {
        const layout = [...targetEntity.layout];
        const [removed] = layout.splice(sourceIndex, 1);
        layout.splice(targetIndex, 0, removed);

        nextEntities[targetId] = {
          ...targetEntity,
          layout,
        };
      } else if (targetId !== sourceId) {
        nextEntities[targetId] = {
          ...targetEntity,
          layout: [
            ...targetEntity.layout.slice(0, targetIndex),
            entity.id,
            ...targetEntity.layout.slice(targetIndex),
          ],
        };

        if (!isNewEntity) { // if not new, also remove from source
          nextEntities[sourceId] = {
            ...sourceEntity,
            layout: sourceEntity.layout.filter(id => id !== entity.id),
          };
        }
      }

      return { ...state, entities: nextEntities, draggingId: null };
    });
  }

  handleDragStart({ draggableId }) {
    this.setState(() => ({ draggingId: draggableId }));
  }

  handleToggleEditMode() {
    this.setState(({ editMode }) => ({ editMode: !editMode }));
  }

  recusiveRenderComponent(id) {
    const { type, layout, droppable, props } = this.state.entities[id];
    const Component = COMPONENT_LOOKUP[type];
    console.log(id, type, 'droppable', droppable);
    return (
      <Component {...props}>
        {droppable &&
          <Droppable droppableId={id} isDropDisabled={!this.state.editMode || (this.state.draggingId && id === GRID_ID)}>
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
                {provided.placeholder}
                {layout.map(childId => (
                  <Draggable
                    key={childId}
                    draggableId={childId}
                    isDragDisabled={!this.state.editMode}
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
                          {this.recusiveRenderComponent(childId)}
                        </div>
                        {providedDrag.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>}
      </Component>
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
        <Checkbox
          id="dnd_edit_mode_toggle"
          label="Edit mode"
          checked={this.state.editMode}
          onChange={this.handleToggleEditMode}
        />

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
            {this.recusiveRenderComponent(GRID_ID)}
          </div>

          {this.state.editMode &&
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
              <Droppable
                droppableId={`${NEW_PREFIX}*`}
                isDropDisabled
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                  >
                    {provided.placeholder}
                    {[Chart, Tabs, Container, Separator, Header].map(Component => (
                      <div style={{ padding: 8 }} key={Component.name}>
                        <strong style={{ textTransform: 'uppercase' }}>{Component.name}</strong>
                        <br />
                        <Draggable
                          draggableId={`${NEW_PREFIX}${Component.name}`}
                          isDragDisabled={!this.state.editMode}
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
            </div>}
        </div>
      </DragDropContext>
    );
  }
}

export default withScreenSize(App);
