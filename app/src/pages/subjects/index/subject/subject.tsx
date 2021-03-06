import React, { useState } from 'react';

import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { Query } from 'material-table';

import resources from 'config/resources';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';
import MaterialTable from 'lib/material-table';

import SimpleDialog from 'components/SimpleDialog';
import useResources from 'components/useResources';

import { Subject as SubjectT, SubjectProps } from './types';

const Subject: React.FC<SubjectProps> = props => {
  const { t } = useTranslation(namespaces.pages.subjects.index);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [archiveId, setArchiveId] = useState<string | undefined>(undefined);

  const canDelete = useResources([[resources.subject.delete]]);

  if (!props.selectedSubjectType)
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
      <Box display="flex" justifyContent="flex-end">
        <FormControlLabel
          // prettier-ignore
          control={(
            <Switch
              color="primary"
              checked={props.showArchived}
              onChange={e => props.onShowArchivedChange(e.target.checked)}
            />
          )}
          label={t('showArchived')}
        />
      </Box>
      <SimpleDialog
        loading={dialogLoading}
        open={Boolean(deleteId)}
        title={t('deleteDialog.title')}
        content={<Typography>{t('deleteDialog.description')}</Typography>}
        actions={[
          <Button
            key={0}
            color="primary"
            onClick={() => setDeleteId(undefined)}
          >
            {t('common:actions.cancel')}
          </Button>,
          <Button
            key={1}
            color="primary"
            variant="contained"
            onClick={() => {
              setDialogLoading(true);
              props.onDelete(`${deleteId}`).then(successful => {
                setDialogLoading(false);
                if (successful) setDeleteId(undefined);
              });
            }}
          >
            {t('common:actions.delete')}
          </Button>,
        ]}
      />
      <SimpleDialog
        open={archiveId !== undefined}
        loading={dialogLoading}
        title={
          props.showArchived
            ? t('unarchiveDialogTitle')
            : t('archiveDialogTitle')
        }
        actions={[
          <Button
            key={0}
            color="primary"
            onClick={() => setArchiveId(undefined)}
          >
            {t('common:actions.cancel')}
          </Button>,
          <Button
            key={1}
            color="primary"
            variant="contained"
            onClick={() => {
              setDialogLoading(true);
              props
                .onArchive(`${archiveId}`, !props.showArchived)
                .then(success => {
                  setDialogLoading(false);
                  if (success) {
                    setArchiveId(undefined);
                  }
                });
            }}
          >
            {props.showArchived
              ? t('common:actions.unarchive')
              : t('common:actions.archive')}
          </Button>,
        ]}
      />
      <MaterialTable
        key={`${props.selectedSubjectType}-${dialogLoading}-${props.showArchived}`}
        title={t('subjects')}
        uniqueName="pages/subjects/subject/subject"
        columns={[
          {
            title: `${t('group')}/${t('classGroup')}`,
            render: (row: SubjectT) => {
              if (row.classGroup)
                return `${row.classGroup.year} ${row.classGroup.section}`;
              if (row.group) return row.group.section;

              return '-';
            },
          },
          {
            title: t('teacher'),
            render: (row: SubjectT) =>
              `${row.teacher?.firstname} ${row.teacher?.lastname}`,
          },
          {
            title: t('common:gqlObjects.subject.archivedAt'),
            field: 'archivedAt',
            hidden: !props.showArchived,
          },
        ]}
        options={{ filtering: false, exportButton: true }}
        data={(query: Query<SubjectT>) =>
          props.onGetSubjects(query).then(res => ({
            totalCount: res.totalCount,
            data: res.subjects,
            page: query.page,
          }))
        }
        actions={[
          {
            icon: EditIcon,
            tooltip: t('common:actions.edit'),
            onClick: (_, row) => {
              row = row as SubjectT;
              props.onEdit(row.id);
            },
          },
          {
            icon: DeleteIcon,
            tooltip: t('common:actions.delete'),
            onClick: (_, row) => {
              row = row as SubjectT;
              setDeleteId(row.id);
            },
            hidden: !canDelete,
            position: !canDelete ? 'toolbar' : 'row',
          },
          {
            icon: props.showArchived ? UnarchiveIcon : ArchiveIcon,
            tooltip: props.showArchived
              ? t('common:actions.unarchive')
              : t('common:actions.archive'),
            onClick: (_, row) => {
              row = row as SubjectT;
              setArchiveId(row.id);
            },
          },
        ]}
      />
      <Box pt={2} display="flex" justifyContent="flex-end">
        <Button color="primary" variant="contained" onClick={props.onAddClick}>
          {t('common:actions.add')}
        </Button>
      </Box>
    </Box>
  );
};

export default Subject;
