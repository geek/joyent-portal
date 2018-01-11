import React, { Fragment } from 'react';
import { set } from 'react-redux-values';
import { Margin } from 'styled-components-spacing';
import { compose, graphql } from 'react-apollo';
import ReduxForm from 'declarative-redux-form';
import { connect } from 'react-redux';
import get from 'lodash.get';
import forceArray from 'force-array';

import { NetworkIcon, P, Button, H3, StatusLoader } from 'joyent-ui-toolkit';

import Title from '@components/create-instance/title';
import Network from '@components/create-instance/network';
import ListNetworks from '@graphql/list-networks.gql';

const FORM_NAME = 'CREATE-INSTANCE-NETWORKS';

export const Networks = ({
  networks = [],
  expanded = false,
  proceeded = false,
  loading = false,
  setInfoExpanded,
  handleNext,
  handleEdit
}) => {
  const selected = networks.filter(({ selected }) => selected);

  return (
    <Fragment>
      <Title icon={<NetworkIcon />}>Networks</Title>
      {expanded ? (
        <Margin bottom={3}>
          <P>
            Instances are automatically connected to a private fabric network,
            which is the best choice for internal communication within your
            application. Data center networks are the best choice for exposing
            your application to the public internet (if the data center network
            is a public network).{' '}
            <a
              target="__blank"
              href="https://docs.joyent.com/public-cloud/network/sdn"
            >
              Read more
            </a>
          </P>
        </Margin>
      ) : null}
      {proceeded && !expanded ? (
        <H3>
          {selected.length} network{selected.length === 1 ? '' : 's'} added
        </H3>
      ) : null}
      {loading && expanded ? <StatusLoader /> : null}
      {!loading ? (
        <ReduxForm
          form={FORM_NAME}
          destroyOnUnmount={false}
          forceUnregisterOnUnmount={true}
        >
          {props => (
            <form>
              {networks.map(
                ({ id, selected, infoExpanded, ...network }) =>
                  !expanded && !selected ? null : (
                    <Network
                      key={id}
                      id={id}
                      selected={selected}
                      infoExpanded={infoExpanded}
                      small={!expanded && selected}
                      onInfoClick={() => setInfoExpanded(id, !infoExpanded)}
                      {...network}
                    />
                  )
              )}
            </form>
          )}
        </ReduxForm>
      ) : null}
      <div>
        {expanded ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : proceeded ? (
          <Button type="button" onClick={handleEdit} secondary>
            Edit
          </Button>
        ) : null}
      </div>
    </Fragment>
  );
};

export default compose(
  graphql(ListNetworks, {
    props: ({ data }) => {
      const { networks = [], loading = false, error = null, refetch } = data;

      return {
        networks: forceArray(networks),
        loading,
        error,
        refetch
      };
    }
  }),
  connect(
    ({ values, form }, { networks }) => {
      const selected = get(form, `${FORM_NAME}.values`, {});

      return {
        proceeded: get(values, 'create-instance-networks-proceeded', false),
        networks: networks.map(({ id, ...network }) => ({
          ...network,
          selected: Boolean(selected[id]),
          infoExpanded: get(
            values,
            `create-instance-networks-${id}-expanded`,
            false
          ),
          id
        }))
      };
    },
    (dispatch, { history }) => ({
      handleNext: () => {
        dispatch(
          set({ name: 'create-instance-networks-proceeded', value: true })
        );

        return history.push('/instances/~create/cns');
      },
      handleEdit: () => {
        return history.push('/instances/~create/networks');
      },
      setInfoExpanded: (id, expanded) => {
        return dispatch(
          set({
            name: `create-instance-networks-${id}-expanded`,
            value: expanded
          })
        );
      }
    })
  )
)(Networks);
