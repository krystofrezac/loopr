import React, { useState } from 'react';

import { Box, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import { Query } from 'material-table';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';
import MaterialTable from 'lib/material-table';

import { DetailGroupUser, GroupProps } from './types';

const Edit = (): JSX.Element => <EditIcon color="primary" />;
const Done = (): JSX.Element => <DoneIcon color="primary" />;
const Close = (): JSX.Element => <CloseIcon color="error" />;
const Group: React.FC<GroupProps> = props => {
  const { t } = useTranslation(namespaces.pages.groups.index);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!props.selectedGroup)
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography>{t('nothingSelected')}</Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <MaterialTable
        key={props.selectedGroup + editing}
        uniqueName="pages/groups/group"
        isLoading={loading || props.loading}
        title={t('students')}
        data={(query: Query<DetailGroupUser>) =>
          editing
            ? props.getUsers(query).then(res => ({
                page: query.page,
                totalCount: res.totalCount,
                data: res.users,
              }))
            : props.getGroupUsers(query).then(res => ({
                page: query.page,
                totalCount: res.totalCount,
                data: res.users,
              }))
        }
        onSelectionChange={data => {
          props.onSelectionChange(data);
        }}
        columns={[]}
        defaultActions={{
          columnFiltering: {
            active: true,
            columns: [
              {
                title: t('common:gqlObjects.user.email'),
                field: 'email',
              },
              {
                title: t('common:gqlObjects.user.firstname'),
                field: 'firstname',
              },
              {
                title: t('common:gqlObjects.user.lastname'),
                field: 'lastname',
              },
              {
                title: t('common:gqlObjects.user.classGroup'),
                field: 'classGroup',
                lookup: props.classGroupLookup,
              },
            ],
            defaultColumns: ['firstname', 'lastname'],
          },
        }}
        options={{ selection: editing, exportButton: true }}
        actions={[
          {
            tooltip: t('common:actions.edit'),
            icon: Edit,
            onClick: () => {
              setEditing(true);
            },
            hidden: editing,
            isFreeAction: true,
          },
          {
            tooltip: t('common:actions.cancel'),
            icon: Close,
            onClick: () => {
              setEditing(false);
              props.onSelectionCancel();
            },
            hidden: !editing,
            isFreeAction: true,
          },
          {
            tooltip: t('common:actions.save'),
            icon: Done,
            onClick: () => {
              setLoading(true);
              props.onSubmit().then(success => {
                setLoading(false);
                if (success) setEditing(false);
              });
            },
            hidden: !editing,
            isFreeAction: true,
          },
        ]}
      />
    </Box>
  );
};

export default Group;
