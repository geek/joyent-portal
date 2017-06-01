import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ServicesQuery from '@graphql/ServicesTopology.gql';
import unitcalc from 'unitcalc';

import { processServices } from '@root/state/selectors';
import { toggleServicesQuickActions } from '@root/state/actions';

import { LayoutContainer } from '@components/layout';
import { Loader, ErrorMessage } from '@components/messaging';
import { ServicesQuickActions } from '@components/services';

import { Topology } from 'joyent-ui-toolkit';

const StyledBackground = styled.div`
  padding: ${unitcalc(4)};
  background-color: ${props => props.theme.whiteActive};
`;

const StyledContainer = styled.div`
  position: relative;
`;

const ServicesTopology = ({
  url,
  push,
  services,
  datacenter,
  loading,
  error,
  servicesQuickActions,
  toggleServicesQuickActions
}) => {
  if (loading) {
    return (
      <LayoutContainer>
        <Loader />
      </LayoutContainer>
    );
  } else if (error) {
    return (
      <LayoutContainer>
        <ErrorMessage message="Oops, and error occured while loading your services." />
      </LayoutContainer>
    );
  }

  const handleQuickActionsClick = (evt, tooltipData) => {
    toggleServicesQuickActions(tooltipData);
  };

  const handleTooltipBlur = evt => {
    toggleServicesQuickActions({ show: false });
  };

  const handleNodeTitleClick = (evt, { service }) => {
    push(`${url.split('/').slice(0, 3).join('/')}/services/${service.slug}`);
  };

  return (
    <StyledBackground>
      <StyledContainer>
        <Topology
          services={services}
          onQuickActionsClick={handleQuickActionsClick}
          onNodeTitleClick={handleNodeTitleClick}
        />
        <ServicesQuickActions
          show={servicesQuickActions.show}
          position={servicesQuickActions.position}
          onBlur={handleTooltipBlur}
        />
      </StyledContainer>
    </StyledBackground>
  );
};

const mapStateToProps = (state, ownProps) => ({
  servicesQuickActions: state.ui.services.quickActions,
  url: ownProps.match.url,
  push: ownProps.history.push
});

const mapDispatchToProps = dispatch => ({
  toggleServicesQuickActions: data => dispatch(toggleServicesQuickActions(data))
});

const UiConnect = connect(mapStateToProps, mapDispatchToProps);

const ServicesGql = graphql(ServicesQuery, {
  options(props) {
    return {
      variables: {
        deploymentGroupSlug: props.match.params.deploymentGroup
      }
    };
  },
  props: ({ data: { deploymentGroup, loading, error } }) => ({
    services: deploymentGroup
      ? processServices(deploymentGroup.services, null)
      : null,
    loading,
    error
  })
});

const ServicesTopologyWithData = compose(ServicesGql, UiConnect)(
  ServicesTopology
);

export default ServicesTopologyWithData;
