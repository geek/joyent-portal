import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../constants';
import GraphNodeTitle from './title';
import GraphNodeButton from './button';
import GraphNodeContent from './content';
import { GraphNodeRect, GraphShadowRect } from './shapes';
import Baseline from '../../baseline';

const GraphNode = ({
  connected,
  data,
  index,
  onDragStart,
  onNodeTitleClick,
  onQuickActions
}) => {
  const { width, height } = data.children
    ? Constants.nodeSizeWithChildren
    : Constants.nodeSize;

  const { left, top } = data.children
    ? Constants.nodeRectWithChildren
    : Constants.nodeRect;

  let x = data.x;
  let y = data.y;
  if (connected) {
    x = data.x + left;
    y = data.y + top;
  }

  const onButtonClick = evt => {
    const tooltipPosition = {
      x: data.x + Constants.buttonRect.x + Constants.buttonRect.width / 2,
      y: data.y + Constants.buttonRect.y + Constants.buttonRect.height
    };

    if (connected) {
      tooltipPosition.x += left;
      tooltipPosition.y += top;
    }

    const d = {
      service: data,
      position: {
        left: tooltipPosition.x,
        top: tooltipPosition.y
      }
    };

    onQuickActions(evt, d);
  };

  const onTitleClick = evt => onNodeTitleClick(evt, { service: data });

  const onStart = evt => {
    evt.preventDefault();
    onDragStart(evt, data.id);
  };

  const nodeRectEvents = connected
    ? {
        onMouseDown: onStart,
        onTouchStart: onStart
      }
    : {};

  const nodeContent = data.children
    ? data.children.map((d, i) =>
        <GraphNodeContent
          key={i}
          child
          connected={connected}
          data={d}
          index={i}
        />
      )
    : <GraphNodeContent connected={connected} data={data} />;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <GraphShadowRect
        x={0}
        y={3}
        width={width}
        height={height}
        connected={connected}
      />
      <GraphNodeRect
        x={0}
        y={0}
        width={width}
        height={height}
        connected={connected}
        {...nodeRectEvents}
      />
      <GraphNodeTitle
        connected={connected}
        data={data}
        onNodeTitleClick={onTitleClick}
      />
      <GraphNodeButton
        connected={connected}
        index={index}
        onButtonClick={onButtonClick}
      />
      {nodeContent}
    </g>
  );
};

GraphNode.propTypes = {
  connected: PropTypes.bool,
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onNodeTitleClick: PropTypes.func,
  onQuickActions: PropTypes.func
};

export default Baseline(GraphNode);
