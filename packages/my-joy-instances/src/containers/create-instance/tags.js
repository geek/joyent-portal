import React, { Fragment } from 'react';
import { set } from 'react-redux-values';
import { Margin } from 'styled-components-spacing';
import { compose } from 'react-apollo';
import { destroy, reset } from 'redux-form';
import ReduxForm from 'declarative-redux-form';
import { connect } from 'react-redux';
import get from 'lodash.get';
import remcalc from 'remcalc';

import {
  TagsIcon,
  Button,
  H3,
  TagList,
  Divider,
  KeyValue
} from 'joyent-ui-toolkit';

import Title from '@components/create-instance/title';
import Description from '@components/description';
import Tag from '@components/tags';
import { addTag as validateTag } from '@state/validators';
import { Forms, Values } from '@root/constants';

const { IC_TAG_F_ADD, IC_TAG_F_EDIT } = Forms;
const { IC_TAG_V_PROCEEDED, IC_TAG_V_ADD_OPEN, IC_TAG_V_TAGS } = Values;

export const Tags = ({
  step,
  tags = [],
  expanded,
  proceeded,
  addOpen,
  handleAddTag,
  handleRemoveTag,
  handleUpdateTag,
  handleToggleExpanded,
  handleCancelEdit,
  handleChangeAddOpen,
  handleNext,
  handleEdit,
  shouldAsyncValidate,
  handleAsyncValidate
}) => (
  <Fragment>
    <Title
      id={step}
      onClick={!expanded && !proceeded && handleEdit}
      collapsed={!expanded && !proceeded}
      icon={<TagsIcon />}
    >
      Tags
    </Title>
    {expanded ? (
      <Description>
        Tags can be used to identify your instances, group multiple instances
        together, define firewall and affinity rules, and more.{' '}
        <a
          target="__blank"
          href="https://docs.joyent.com/public-cloud/tags-metadata/tags"
          rel="noopener noreferrer"
        >
          Read the docs
        </a>
      </Description>
    ) : null}
    {proceeded || expanded ? (
      <Fragment>
        <Margin bottom={4}>
          <H3>
            {tags.length} Tag{tags.length === 1 ? '' : 's'}
          </H3>
        </Margin>
        <TagList>
          {tags.map(({ name, value }, index) => (
            <Tag
              key={index}
              name={name}
              value={value}
              onRemoveClick={expanded && (() => handleRemoveTag(index))}
            />
          ))}
        </TagList>
      </Fragment>
    ) : null}
    <ReduxForm
      form={IC_TAG_F_ADD}
      destroyOnUnmount={false}
      forceUnregisterOnUnmount={true}
      shouldAsyncValidate={shouldAsyncValidate}
      asyncValidate={handleAsyncValidate}
      onSubmit={handleAddTag}
    >
      {props =>
        expanded && addOpen ? (
          <Fragment>
            <KeyValue
              {...props}
              method="add"
              input="input"
              type="tag"
              expanded
              onCancel={() => handleChangeAddOpen(false)}
            />
            <Divider height={remcalc(18)} transparent />
          </Fragment>
        ) : null
      }
    </ReduxForm>
    {expanded ? (
      <Margin top={1} bottom={7}>
        <Button
          type="button"
          onClick={() => handleChangeAddOpen(true)}
          secondary
        >
          Add Tag
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </Margin>
    ) : proceeded ? (
      <Margin top={1} bottom={7}>
        <Button type="button" onClick={handleEdit} secondary>
          Edit
        </Button>
      </Margin>
    ) : null}
  </Fragment>
);

export default compose(
  connect(({ values }, ownProps) => {
    const proceeded = get(values, IC_TAG_V_PROCEEDED, false);
    const addOpen = get(values, IC_TAG_V_ADD_OPEN, false);
    const tags = get(values, IC_TAG_V_TAGS, []);

    return {
      proceeded: proceeded || tags.length,
      addOpen,
      tags
    };
  }),
  connect(null, (dispatch, { tags = [], history }) => ({
    handleNext: () => {
      dispatch(set({ name: IC_TAG_V_PROCEEDED, value: true }));
      return history.push(
        `/instances/~create/metadata${history.location.search}`
      );
    },
    handleEdit: () => {
      dispatch(set({ name: IC_TAG_V_PROCEEDED, value: true }));
      return history.push(`/instances/~create/tags${history.location.search}`);
    },
    shouldAsyncValidate: ({ trigger }) => {
      return trigger === 'submit';
    },
    handleAsyncValidate: validateTag,
    handleAddTag: value => {
      const toggleToClosed = set({ name: IC_TAG_V_ADD_OPEN, value: false });

      const appendTag = set({
        name: IC_TAG_V_TAGS,
        value: tags.concat([{ ...value, expanded: false }])
      });

      return dispatch([destroy(IC_TAG_F_ADD), toggleToClosed, appendTag]);
    },
    handleUpdateTag: (index, newTag) => {
      tags[index] = {
        ...newTag,
        expanded: false
      };

      return dispatch([
        destroy(IC_TAG_F_EDIT(index)),
        set({ name: IC_TAG_V_TAGS, value: tags.slice() })
      ]);
    },
    handleChangeAddOpen: value => {
      return dispatch([
        reset(IC_TAG_F_ADD),
        set({ name: IC_TAG_V_ADD_OPEN, value })
      ]);
    },
    handleToggleExpanded: index => {
      tags[index] = {
        ...tags[index],
        expanded: !tags[index].expanded
      };

      return dispatch(set({ name: IC_TAG_V_TAGS, value: tags.slice() }));
    },
    handleCancelEdit: index => {
      tags[index] = {
        ...tags[index],
        expanded: false
      };

      return dispatch([
        reset(IC_TAG_F_EDIT(index)),
        set({ name: IC_TAG_V_TAGS, value: tags.slice() })
      ]);
    },
    handleRemoveTag: index => {
      tags.splice(index, 1);

      return dispatch([
        destroy(IC_TAG_F_EDIT(index)),
        set({ name: IC_TAG_V_TAGS, value: tags.slice() })
      ]);
    }
  }))
)(Tags);
