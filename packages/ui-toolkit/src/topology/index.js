import React from 'react';
import { Svg } from 'normalized-styled-components';
import PropTypes from 'prop-types';

import Baseline from '../baseline';
import Constants from './constants';
import { createSimulation } from './simulation';
import TopologyNode from './node';
import TopologyLink from './link';
import TopologyLinkArrow from './link/arrow';
import { calculateLineLayout } from './link/functions';

const StyledSvg = Svg.extend`
  width: 100%;
  height: 1400px;
`;

/**
 * @example ./usage.md
 */
class Topology extends React.Component {
  componentWillMount() {
    const services = this.getServicesWithoutConsul();
    const svgSize = this.getSvgSize();

    const { nodes, links, simulation } = createSimulation(services, svgSize);

    this.setState({
      nodes,
      links,
      simulation
    });
  }

  getServicesWithoutConsul() {
    return this.props.services.reduce((acc, service, index) => {
      if (service.id !== 'consul') acc.push(service);
      return acc;
    }, []);
  }

  getSvgSize() {
    if (document.getElementById('topology-svg')) {
      return document.getElementById('topology-svg').getBoundingClientRect();
    }

    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    return {
      width: windowWidth - 2 * 24,
      height: 1400
    };
  }

  constrainNodePosition(x, y, children = false) {
    const svgSize = this.getSvgSize();

    const nodeRect = children
      ? Constants.nodeRectWithChildren
      : Constants.nodeRect;

    if (x < nodeRect.right + 2) {
      x = nodeRect.right + 2;
    } else if (x > svgSize.width + nodeRect.left - 2) {
      x = svgSize.width + nodeRect.left - 2;
    }

    if (y < -nodeRect.top + 2) {
      y = -nodeRect.top + 2;
    } else if (y > svgSize.height - nodeRect.bottom - 2) {
      y = svgSize.height - nodeRect.bottom - 2;
    }

    return {
      x,
      y
    };
  }

  findNode(nodeId) {
    return this.state.nodes.reduce(
      (acc, simNode, index) => (simNode.id === nodeId ? simNode : acc),
      {}
    );
  }

  getConsulNodePosition() {
    const svgSize = this.getSvgSize();
    const x = svgSize.width - Constants.nodeSize.width;

    return {
      x,
      y: 0
    };
  }

  getConstrainedNodePosition(nodeId, children = false) {
    const node = this.findNode(nodeId);
    return this.constrainNodePosition(node.x, node.y, children);
  }

  findNodeData(nodesData, nodeId) {
    return nodesData.reduce(
      (acc, nodeData, index) => (nodeData.id === nodeId ? nodeData : acc),
      {}
    );
  }

  setDragInfo(dragging, nodeId = null, position = {}) {
    this.dragInfo = {
      dragging,
      nodeId,
      position
    };
  }

  render() {
    const { onQuickActionsClick, onNodeTitleClick, services } = this.props;

    const { nodes, links } = this.state;

    const nodesData = services.map((service, index) => {
      const nodePosition = service.id === 'consul'
        ? this.getConsulNodePosition()
        : this.getConstrainedNodePosition(service.id, service.children);

      return {
        ...service,
        ...nodePosition
      };
    });

    // TODO links will need to know whether a service has children
    // if it does, the height of it will be different
    const linksData = links
      .map((link, index) => ({
        source: this.findNodeData(nodesData, link.source.id),
        target: this.findNodeData(nodesData, link.target.id)
      }))
      .map((linkData, index) => calculateLineLayout(linkData, index));

    const onDragStart = (evt, nodeId) => {
      // It's this node's position that we'll need to update

      const x = evt.changedTouches ? evt.changedTouches[0].pageX : evt.clientX;
      const y = evt.changedTouches ? evt.changedTouches[0].pageY : evt.clientY;

      this.setDragInfo(true, nodeId, {
        x,
        y
      });
    };

    const onDragMove = evt => {
      if (this.dragInfo && this.dragInfo.dragging) {
        const x = evt.changedTouches
          ? evt.changedTouches[0].pageX
          : evt.clientX;
        const y = evt.changedTouches
          ? evt.changedTouches[0].pageY
          : evt.clientY;

        const offset = {
          x: x - this.dragInfo.position.x,
          y: y - this.dragInfo.position.y
        };

        const dragNodes = nodes.map((simNode, index) => {
          if (simNode.id === this.dragInfo.nodeId) {
            return {
              ...simNode,
              x: simNode.x + offset.x,
              y: simNode.y + offset.y
            };
          }
          return {
            ...simNode
          };
        });

        this.setState({
          nodes: dragNodes
        });

        this.setDragInfo(true, this.dragInfo.nodeId, {
          x,
          y
        });
      }
    };

    const onDragEnd = evt => {
      this.setDragInfo(false);
    };

    const renderedNode = (n, index) =>
      <TopologyNode
        key={index}
        data={n}
        index={index}
        onDragStart={onDragStart}
        onNodeTitleClick={onNodeTitleClick}
        onQuickActions={onQuickActionsClick}
        connected={n.id !== 'consul'}
      />;

    const renderedLink = (l, index) =>
      <TopologyLink key={index} data={l} index={index} />;

    const renderedLinkArrow = (l, index) =>
      <TopologyLinkArrow key={index} data={l} index={index} />;

    const renderedNodes = this.dragInfo && this.dragInfo.dragging
      ? nodesData
          .filter((n, index) => n.id !== this.dragInfo.nodeId)
          .map((n, index) => renderedNode(n, index))
      : nodesData.map((n, index) => renderedNode(n, index));

    const renderedLinks = linksData.map((l, index) => renderedLink(l, index));

    const renderedLinkArrows = this.dragInfo && this.dragInfo.dragging
      ? linksData
          .filter((l, index) => l.target.id !== this.dragInfo.nodeId)
          .map((l, index) => renderedLinkArrow(l, index))
      : linksData.map((l, index) => renderedLinkArrow(l, index));

    const dragNode = !this.dragInfo || !this.dragInfo.dragging
      ? null
      : renderedNode(
          nodesData.reduce((dragNode, n, index) => {
            if (n.id === this.dragInfo.nodeId) {
              return n;
            }
            return dragNode;
          }, {})
        );

    const dragLinkArrow = !this.dragInfo ||
      !this.dragInfo.dragging ||
      renderedLinkArrows.length === renderedLinks.length
      ? null
      : renderedLinkArrow(
          linksData.reduce((dragLinkArrow, l, index) => {
            if (l.target.id === this.dragInfo.nodeId) {
              return l;
            }
            return dragLinkArrow;
          }, {})
        );

    return (
      <StyledSvg
        onMouseMove={onDragMove}
        onTouchMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
        id="topology-svg"
      >
        <g>
          {renderedNodes}
        </g>
        <g>
          {renderedLinks}
        </g>
        <g>
          {renderedLinkArrows}
        </g>
        <g>
          {dragNode}
        </g>
        <g>
          {dragLinkArrow}
        </g>
      </StyledSvg>
    );
  }
}

Topology.propTypes = {
  onQuickActionsClick: PropTypes.func,
  onNodeTitleClick: PropTypes.func,
  services: PropTypes.array
};

export default Baseline(Topology);

export { default as TopologyNode } from './node';
export { default as TopologyLink } from './link';
