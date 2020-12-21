import React, { useState } from 'react';

import { Box, Button, Typography } from '@material-ui/core';
import { Query } from 'material-table';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';
import MaterialTable from 'lib/material-table';

import { DetailGroupUser, GroupProps } from './types';

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
        isLoading={loading}
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
        onSelectionChange={(data, row) => {
          console.log('row', row);
          if (row) {
            props.onSelectionChange({
              id: row?.id,
              selected: row?.tableData?.checked || false,
            });
          }
        }}
        columns={[
          { title: t('common:gqlObjects.user.firstname'), field: 'firstname' },
          { title: t('common:gqlObjects.user.lastname'), field: 'lastname' },
        ]}
        options={{ selection: editing }}
      />
      <Box pt={2} display="flex" justifyContent="flex-end">
        {editing ? (
          <>
            <Box pr={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setLoading(true);
                  props.onSubmit().then(success => {
                    setLoading(false);
                    if (success) setEditing(false);
                  });
                }}
              >
                {t('common:actions.save')}
              </Button>
            </Box>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setEditing(false)}
            >
              {t('common:actions.cancel')}
            </Button>
          </>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setEditing(true)}
          >
            {t('common:actions.edit')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Group;
