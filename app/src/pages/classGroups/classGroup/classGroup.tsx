import React from 'react';

import { Box, Typography } from '@material-ui/core';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import StudentsIndex from 'pages/classGroups/classGroup/students';

import Tabs from 'components/Tabs';

import TeacherIndex from './teacher';
import { ClassGroupProps } from './types';

const TabWrapper: React.FC = props => (
  <Box p={2} pt={0}>
    {props.children}
  </Box>
);

const ClassGroup: React.FC<ClassGroupProps> = props => {
  const { t } = useTranslation(namespaces.pages.classGroups.index);

  if (!props.selectedClassGroup)
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
    <Tabs
      variant="fullWidth"
      TabWrapper={TabWrapper}
      tabs={[
        {
          id: 0,
          label: t('students'),
          panel: <StudentsIndex />,
        },
        {
          id: 1,
          label: t('teacher'),
          panel: <TeacherIndex />,
        },
      ]}
    />
  );
};

export default ClassGroup;
