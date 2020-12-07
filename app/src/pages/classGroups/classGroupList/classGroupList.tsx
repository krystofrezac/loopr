import React, { useState } from 'react';

import { Button, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import SideList from 'components/SideList';
import SimpleDialog from 'components/SimpleDialog';

import ClassGroupDialog from './classGroupDialog';
import { ClassGroupListProps } from './types';

const ClassGroupList: React.FC<ClassGroupListProps> = props => {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  const editingClassGroup = props.classGroups.find(
    classGroup => classGroup.id === editId,
  );

  return (
    <>
      <SimpleDialog
        open={Boolean(deleteId)}
        loading={props.deleteLoading}
        title="Sure??"
        content={<Typography>Irreversible</Typography>}
        actions={[
          <Button
            key={0}
            color="primary"
            onClick={() => {
              setDeleteId(undefined);
            }}
          >
            Cancel
          </Button>,
          <Button
            key={1}
            color="primary"
            variant="contained"
            onClick={() => {
              props.onDelete(`${deleteId}`).then(successful => {
                if (successful) {
                  setDeleteId(undefined);
                }
              });
            }}
          >
            Delete
          </Button>,
        ]}
      />
      <ClassGroupDialog
        open={addOpen || editId !== undefined}
        title={addOpen ? 'Add class' : 'Edit class'}
        loading={props.addClassGroupLoading || props.updateClassGroupLoading}
        primaryButtonLabel={addOpen ? 'Add' : 'Edit'}
        onSubmit={values => {
          if (addOpen) {
            props.onAdd(values).then((success: boolean) => {
              if (success) {
                setAddOpen(false);
              }
            });
          } else if (editId) {
            props
              .onUpdate({ ...values, id: editId })
              .then((success: boolean) => {
                if (success) {
                  setEditId(undefined);
                }
              });
          }
        }}
        defaultValues={
          editId && editingClassGroup
            ? {
                year: editingClassGroup.year,
                section: editingClassGroup.section,
              }
            : undefined
        }
        onClose={() => {
          setAddOpen(false);
          setEditId(undefined);
        }}
      />
      <SideList
        title="Classes"
        loading={props.classGroupsLoading}
        bottomAction={{
          icon: <AddIcon />,
          onClick: () => {
            setAddOpen(true);
          },
        }}
        items={props.classGroups.map(classGroup => ({
          id: classGroup.id,
          primary: classGroup?.section,
          secondary: `${classGroup?.year}`,
          additionalActions: [
            <IconButton key={0} onClick={() => setEditId(classGroup.id)}>
              <EditIcon />
            </IconButton>,
            <IconButton key={1} onClick={() => setDeleteId(classGroup.id)}>
              <DeleteIcon />
            </IconButton>,
          ],
          onClick: () => props.onSelectedClassChange(classGroup.id),
        }))}
      />
    </>
  );
};

export default ClassGroupList;