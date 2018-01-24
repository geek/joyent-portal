/* eslint-disable camelcase */

import React, { Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import { Margin } from 'styled-components-spacing';
import ReduxForm from 'declarative-redux-form';
import { set } from 'react-redux-values';
import { connect } from 'react-redux';
import get from 'lodash.get';
import forceArray from 'force-array';

import { StatusLoader, FirewallIcon, H3, Button } from 'joyent-ui-toolkit';

import Title from '@components/create-instance/title';
import Description from '@components/description';
import FirewallForm from '@components/firewall';
import ListFwRules from '@graphql/list-fw-rules.gql';

const FORM_NAME = 'CREATE-INSTANCE-FIREWALL';

const Firewall = ({
  defaultRules = [],
  tagRules = [],
  expanded = false,
  proceeded = false,
  loading = false,
  enabled = false,
  handleNext,
  handleEdit
}) => (
  <Fragment>
    <Title
      onClick={!expanded && !proceeded && handleEdit}
      icon={<FirewallIcon />}
    >
      Firewall
    </Title>
    {expanded ? (
      <Description>
        Cloud Firewall rules control traffic across instances. Enabling the
        firewall adds a default set of rules and rules defined by your chosen
        tags.{' '}
        <a
          target="__blank"
          href="https://docs.joyent.com/public-cloud/network/firewall"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      </Description>
    ) : null}
    <div>
      {loading && expanded ? <StatusLoader /> : null}
      {!loading ? (
        <ReduxForm
          form={FORM_NAME}
          destroyOnUnmount={false}
          forceUnregisterOnUnmount={true}
        >
          {props =>
            expanded ? (
              <FirewallForm
                {...props}
                defaultRules={defaultRules}
                tagRules={tagRules}
                enabled={enabled}
              />
            ) : null
          }
        </ReduxForm>
      ) : null}
      {proceeded && !expanded ? (
        <Margin bottom={4}>
          <H3>{enabled ? 'Firewall Enabled' : 'Firewall Not Enabled'}</H3>
        </Margin>
      ) : null}
      <Fragment>
        {expanded ? (
          <Margin bottom={4}>
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          </Margin>
        ) : proceeded ? (
          <Margin bottom={4}>
            <Button type="button" onClick={handleEdit} secondary>
              Edit
            </Button>
          </Margin>
        ) : null}
      </Fragment>
    </div>
  </Fragment>
);

export default compose(
  connect(
    ({ form, values }, ownProps) => ({
      ...ownProps,
      proceeded: get(values, 'create-instance-firewall-proceeded', false),
      enabled: get(form, `${FORM_NAME}.values.enabled`, false),
      showInactive: get(form, `${FORM_NAME}.values.show-inactive`, false),
      tags: get(values, 'create-instance-tags', [])
    }),
    (dispatch, { history }) => ({
      handleNext: () => {
        dispatch(
          set({ name: 'create-instance-firewall-proceeded', value: true })
        );

        return history.push('/instances/~create/cns');
      },
      handleEdit: () => {
        return history.push('/instances/~create/firewall');
      }
    })
  ),
  graphql(ListFwRules, {
    options: ({ tags, expanded, enabled }) => ({
      fetchPolicy: expanded && enabled ? 'cache-first' : 'cache-only',
      variables: {
        tags: tags.map(({ name, value }) => ({ name, value }))
      }
    }),
    props: ({ ownProps, data }) => {
      const { showInactive } = ownProps;

      const {
        firewall_rules_create_machine = [],
        loading,
        error,
        refetch
      } = data;

      const rules = forceArray(firewall_rules_create_machine).filter(
        ({ enabled }) => enabled || showInactive
      );

      return {
        defaultRules: rules.filter(({ rule_obj = {} }) => rule_obj.isWildcard),
        tagRules: rules.filter(({ rule_obj = {} }) => rule_obj.tags.length),
        loading,
        error,
        refetch
      };
    }
  })
)(Firewall);
