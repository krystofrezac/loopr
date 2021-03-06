import React from 'react';

import { ApolloQueryResult, useApolloClient, useQuery } from '@apollo/client';
import { Query } from 'material-table';

import {
  UserFilter_exists,
  UsersRolesQuery,
  UsersUsersQuery,
  UsersUsersQueryVariables,
} from 'types/graphql';

import stripRolePrefix from 'components/stripRolePrefix';
import usePagination from 'components/usePagination';
import withPage from 'components/withPage';

import USERS_ROLES_QUERY from './queries/roles';
import USERS_USERS_QUERY from './queries/users';
import usersPageOptions from './pageOptions';
import { User } from './types';
import Users from './Users';

const UsersIndex: React.FC = () => {
  const { data: rolesData, loading: rolesLoading } = useQuery<UsersRolesQuery>(
    USERS_ROLES_QUERY,
  );
  const client = useApolloClient();
  const { getPagination, setPagination } = usePagination();

  const getUsers = (
    query: Query<User>,
  ): Promise<ApolloQueryResult<UsersUsersQuery>> => {
    const paginationVariables = getPagination({
      page: query.page,
      pageSize: query.pageSize,
    });

    const emailFilter = query.filters.find(f => f.column.field === 'email')
      ?.value;
    const firstNameFilter = query.filters.find(
      f => f.column.field === 'firstname',
    )?.value;
    const lastNameFilter = query.filters.find(
      f => f.column.field === 'lastname',
    )?.value;
    const rolesFilter = query.filters.find(f => f.column.field === 'role.id')
      ?.value;
    const archivedFilter: string[] =
      query.filters.find(f => f.column.field === 'archived')?.value || [];
    const classGroupsFilter = query.filters.find(
      f => f.column.field === 'classGroup.id',
    )?.value;

    const exists: UserFilter_exists[] = [];
    archivedFilter.forEach(archived =>
      exists.push({ archivedAt: archived === 'true' }),
    );

    return client
      .query<UsersUsersQuery, UsersUsersQueryVariables>({
        query: USERS_USERS_QUERY,
        variables: {
          ...paginationVariables,
          email: emailFilter,
          lastName: lastNameFilter,
          firstName: firstNameFilter,
          roles: rolesFilter,
          classGroups: classGroupsFilter,
          exists,
        },
      })
      .then(res => {
        const edges = res.data?.users?.edges;
        const totalCount = res.data?.users?.totalCount;
        if (edges && totalCount) {
          setPagination({ edges, totalCount });
        }

        return res;
      });
  };

  const rolesLookup: Record<string, string> = {};
  rolesData?.aclRoles?.forEach(role => {
    if (role) rolesLookup[role.id] = stripRolePrefix(role.name);
  });

  const classGroupLookup: Record<string, string> = {};
  rolesData?.classGroups?.edges?.forEach(classGroupEdge => {
    const node = classGroupEdge?.node;
    if (node) classGroupLookup[node.id] = `${node.year} ${node.section}`;
  });

  return (
    <Users
      loading={rolesLoading}
      rolesLookup={rolesLookup}
      classGroupLookup={classGroupLookup}
      getUsers={getUsers}
    />
  );
};

export default withPage(usersPageOptions)(UsersIndex);
