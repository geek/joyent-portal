import React, { Fragment } from 'react';
import { set } from 'react-redux-values';
import { Margin } from 'styled-components-spacing';
import { compose } from 'react-apollo';
import { destroy, reset } from 'redux-form';
import ReduxForm from 'declarative-redux-form';
import { connect } from 'react-redux';
import get from 'lodash.get';

import { MetadataIcon, P, Button, H3 } from 'joyent-ui-toolkit';

import Title from '@components/create-instance/title';
import Description from '@components/create-instance/description';
import KeyValue from '@components/instances/key-value';

const FORM_NAME_CREATE = 'CREATE-INSTANCE-METADATA-ADD';
const FORM_NAME_EDIT = i => `CREATE-INSTANCE-METADATA-EDIT-${i}`;

export const Metadata = ({
  metadata = [],
  expanded,
  proceeded,
  addOpen,
  handleAddMetadata,
  handleRemoveMetadata,
  handleUpdateMetadata,
  handleToggleExpanded,
  handleCancelEdit,
  handleChangeAddOpen,
  handleNext,
  handleEdit
}) => (
  <Fragment>
    <Title icon={<MetadataIcon />}>Metadata</Title>
    {expanded ? (
      <Description>
        Metadata can be used to pass data to the instance. It can also be used
        to inject a custom boot script. Unlike tags, metadata is only viewable
        inside the instance.{' '}
        <a
          target="__blank"
          href="https://docs.joyent.com/public-cloud/tags-metadata/metadata"
        >
          Read the docs
        </a>
      </Description>
    ) : null}
    {proceeded ? (
      <Margin bottom={4}>
        <H3>
          {metadata.length} key:value pair{metadata.length === 1 ? '' : 's'}
        </H3>
      </Margin>
    ) : null}
    {metadata.map(({ name, value, expanded }, index) => (
      <ReduxForm
        form={FORM_NAME_EDIT(index)}
        key={index}
        initialValues={{ name, value }}
        destroyOnUnmount={false}
        forceUnregisterOnUnmount={true}
        onSubmit={newValue => handleUpdateMetadata(index, newValue)}
      >
        {props => (
          <KeyValue
            {...props}
            initialValues={{ name, value }}
            expanded={expanded}
            method="edit"
            input="textarea"
            type="metadata"
            onToggleExpanded={() => handleToggleExpanded(index)}
            onCancel={() => handleCancelEdit(index)}
            onRemove={() => handleRemoveMetadata(index)}
          />
        )}
      </ReduxForm>
    ))}
    {expanded && addOpen ? (
      <ReduxForm
        form={FORM_NAME_CREATE}
        destroyOnUnmount={false}
        forceUnregisterOnUnmount={true}
        onSubmit={handleAddMetadata}
      >
        {props => (
          <KeyValue
            {...props}
            method="add"
            input="textarea"
            type="metadata"
            expanded
            onCancel={() => handleChangeAddOpen(false)}
          />
        )}
      </ReduxForm>
    ) : null}
    <div>
      {expanded ? (
        <Fragment>
          <Button
            type="button"
            onClick={() => handleChangeAddOpen(true)}
            secondary
          >
            Add Metadata
          </Button>
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        </Fragment>
      ) : proceeded ? (
        <Button type="button" onClick={handleEdit} secondary>
          Edit
        </Button>
      ) : null}
    </div>
  </Fragment>
);

export default compose(
  connect(({ values }, ownProps) => ({
    proceeded: get(values, 'create-instance-metadata-proceeded', false),
    addOpen: get(values, 'create-instance-metadata-add-open', false),
    metadata: get(values, 'create-instance-metadata', [])
  })),
  connect(null, (dispatch, { metadata = [], history }) => ({
    handleNext: () => {
      dispatch(
        set({ name: 'create-instance-metadata-proceeded', value: true })
      );

      return history.push(`/instances/~create/networks`);
    },
    handleEdit: () => {
      return history.push(`/instances/~create/metadata`);
    },
    handleAddMetadata: value => {
      const toggleToClosed = set({
        name: `create-instance-metadata-add-open`,
        value: false
      });

      const appendMetadata = set({
        name: `create-instance-metadata`,
        value: metadata.concat([{ ...value, expanded: false }])
      });

      return dispatch([
        destroy(FORM_NAME_CREATE),
        toggleToClosed,
        appendMetadata
      ]);
    },
    handleUpdateMetadata: (index, newMetadata) => {
      metadata[index] = {
        ...newMetadata,
        expanded: false
      };

      return dispatch([
        destroy(FORM_NAME_EDIT(index)),
        set({ name: `create-instance-metadata`, value: metadata.slice() })
      ]);
    },
    handleChangeAddOpen: value => {
      return dispatch([
        reset(FORM_NAME_CREATE),
        set({ name: `create-instance-metadata-add-open`, value })
      ]);
    },
    handleToggleExpanded: index => {
      metadata[index] = {
        ...metadata[index],
        expanded: !metadata[index].expanded
      };

      return dispatch(
        set({
          name: `create-instance-metadata`,
          value: metadata.slice()
        })
      );
    },
    handleCancelEdit: index => {
      metadata[index] = {
        ...metadata[index],
        expanded: false
      };

      return dispatch([
        reset(FORM_NAME_EDIT(index)),
        set({ name: `create-instance-metadata`, value: metadata.slice() })
      ]);
    },
    handleRemoveMetadata: index => {
      metadata.splice(index, 1);

      return dispatch([
        destroy(FORM_NAME_EDIT(index)),
        set({ name: `create-instance-metadata`, value: metadata.slice() })
      ]);
    }
  }))
)(Metadata);
