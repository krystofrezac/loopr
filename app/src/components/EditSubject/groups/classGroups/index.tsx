import React from 'react';

import { useApolloClient } from '@apollo/client';
import { Query } from 'material-table';

import {
  EditSubjectClassGroupsQuery,
  EditSubjectClassGroupsQueryVariables,
} from 'types/graphql';

import usePagination from 'components/usePagination';

import EDIT_SUBJECT_CLASS_GROUPS_QUERY from '../../queries/classGroups';
import useEditSubjectState from '../../state';
import GroupTable from '../groupTable';
import { Group, Groups, OnGetGroupsReturn } from '../types';

const ClassGroups: React.FC = () => {
  const { classGroup, setClassGroup } = useEditSubjectState(state => ({
    classGroup: state.classGroup,
    setClassGroup: state.setClassGroup,
  }));

  const client = useApolloClient();

  const { getPagination, setPagination } = usePagination();

  const getGroupsHandler = (query: Query<Group>): OnGetGroupsReturn => {
    return client
      .query<EditSubjectClassGroupsQuery, EditSubjectClassGroupsQueryVariables>(
        {
          query: EDIT_SUBJECT_CLASS_GROUPS_QUERY,
          variables: {
            ...getPagination({ pageSize: query.pageSize, page: query.page }),
          },
        },
      )
      .then(res => {
        const edges = res.data?.classGroups?.edges;
        const totalCount = res.data?.classGroups?.totalCount;

        if (edges && totalCount) {
          setPagination({ edges, totalCount });

          const classGroups: Groups = [];

          edges?.forEach(classGroup => {
            if (classGroup?.node) {
              classGroups.push(classGroup.node);
            }
          });

          return { totalCount, groups: classGroups };
        }

        return { totalCount: 0, groups: [] };
      });
  };

  return (
    <GroupTable
      classGroup
      selectedGroup={classGroup}
      onSelectedGroupChange={(classGroup: string) => {
        setClassGroup(classGroup);
      }}
      onGetGroups={getGroupsHandler}
    />
  );
};

export default ClassGroups;
