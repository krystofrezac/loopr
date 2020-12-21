import React, { useState } from 'react';

import { useApolloClient, useMutation } from '@apollo/client';
import { Query } from 'material-table';
import { useSnackbar } from 'notistack';

import resources from 'config/resources';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import {
  ClassGroupsClassGroupUsersQuery,
  ClassGroupsClassGroupUsersQueryVariables,
  ClassGroupsUpdateUsersClassGroupMutation,
  ClassGroupsUpdateUsersClassGroupMutationVariables,
  ClassGroupsUsersQuery,
  ClassGroupsUsersQueryVariables,
} from 'types/graphql';

import usePagination from 'components/usePagination';

import CLASS_GROUPS_UPDATE_USERS_CLASS_GROUP_MUTATION from '../../mutations/updateUsersClassGroup';
import CLASS_GROUPS_CLASS_GROUP_USERS_QUERY from '../../queries/classGroupUsers';
import CLASS_GROUPS_USERS_QUERY from '../../queries/users';
import useClassGroupsState from '../../state';

import Students from './students';
import {
  ClassGroupUser,
  GetClassGroupUsersReturn,
  GetUsersReturn,
  SelectionChangeArgs,
  User,
} from './types';

const StudentsIndex: React.FC = () => {
  const { selectedClassGroup } = useClassGroupsState(state => ({
    selectedClassGroup: state.selectedClassGroup,
  }));
  const [updateUsersClassGroup] = useMutation<
    ClassGroupsUpdateUsersClassGroupMutation,
    ClassGroupsUpdateUsersClassGroupMutationVariables
  >(CLASS_GROUPS_UPDATE_USERS_CLASS_GROUP_MUTATION);
  const [changedUsers, setChangedUsers] = useState<
    {
      id: string;
      selected: boolean;
    }[]
  >([]);
  const {
    getPagination: getClassGroupPagination,
    setPagination: setClassGroupPagination,
  } = usePagination();
  const {
    getPagination: getUserPagination,
    setPagination: setUserPagination,
  } = usePagination();
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(namespaces.pages.classGroups.index);

  const getClassGroupUsersHandler = (
    query: Query<ClassGroupUser>,
  ): Promise<GetClassGroupUsersReturn> => {
    const variables = getClassGroupPagination({
      page: query.page,
      pageSize: query.pageSize,
    });

    const defaultValue = { users: [], totalCount: 0 };

    if (selectedClassGroup) {
      return client
        .query<
          ClassGroupsClassGroupUsersQuery,
          ClassGroupsClassGroupUsersQueryVariables
        >({
          query: CLASS_GROUPS_CLASS_GROUP_USERS_QUERY,
          variables: {
            id: selectedClassGroup,
            usersFirst: variables.first,
            usersLast: variables.last,
            usersBefore: variables.before,
            usersAfter: variables.after,
          },
        })
        .then(res => {
          const edges = res.data?.classGroup?.users?.edges;
          const totalCount = res.data?.classGroup?.users?.totalCount;
          if (edges && totalCount) {
            setClassGroupPagination({ edges, totalCount });

            const users = [];
            for (const user of res.data?.classGroup?.users?.edges || []) {
              if (user?.node) users.push(user.node);
            }

            return { users, totalCount };
          }

          return defaultValue;
        });
    }

    return Promise.resolve(defaultValue);
  };
  const getUsersHandler = (query: Query<User>): Promise<GetUsersReturn> => {
    const variables = getUserPagination({
      page: query.page,
      pageSize: query.pageSize,
    });

    const defaultValue = { users: [], totalCount: 0 };

    if (selectedClassGroup) {
      return client
        .query<ClassGroupsUsersQuery, ClassGroupsUsersQueryVariables>({
          query: CLASS_GROUPS_USERS_QUERY,
          variables: {
            ...variables,
            resourceName: resources.user.canStudy,
          },
        })
        .then(res => {
          const edges = res.data?.users?.edges;
          const totalCount = res.data?.users?.totalCount;
          if (edges && totalCount) {
            setUserPagination({ edges, totalCount });

            const users: User[] = [];
            for (const user of res.data?.users?.edges || []) {
              if (user?.node) {
                const node = user?.node;
                users.push({
                  ...node,
                  tableData: {
                    checked: node.classGroup?.id === selectedClassGroup,
                  },
                });
              }
            }

            return { users, totalCount };
          }

          return defaultValue;
        });
    }

    return Promise.resolve(defaultValue);
  };

  const selectionChangeHandler = (args: SelectionChangeArgs): void => {
    setChangedUsers(prevState => {
      const index = prevState.findIndex(
        changedUser => changedUser.id === args.id,
      );
      if (index !== -1) {
        prevState.splice(index, 1);
      } else {
        prevState = [...prevState, { id: args.id, selected: args.selected }];
      }

      return prevState;
    });
  };

  const submitHandler = (): Promise<boolean> => {
    return updateUsersClassGroup({
      variables: {
        input: {
          id: `${selectedClassGroup}`,
          addUsers: changedUsers
            .filter(user => user.selected)
            .map(user => user.id),
          deleteUsers: changedUsers
            .filter(user => !user.selected)
            .map(user => user.id),
        },
      },
    })
      .then(() => {
        enqueueSnackbar(t('snackbars.studentsEdit.success'), {
          variant: 'success',
        });
        setChangedUsers([]);

        return true;
      })
      .catch(() => {
        enqueueSnackbar(t('snackbars.studentsEdit.error'), {
          variant: 'error',
        });

        return false;
      });
  };

  return (
    <Students
      onGetClassGroupUsers={getClassGroupUsersHandler}
      onGetUsers={getUsersHandler}
      onSelectionChange={selectionChangeHandler}
      onSubmit={submitHandler}
    />
  );
};

export default StudentsIndex;
