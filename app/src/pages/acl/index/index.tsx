import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Column } from 'material-table';
import { useSnackbar } from 'notistack';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import HeaderCell from 'pages/acl/index/headerCell';
import ACL_CREATE_ACL_ROLE from 'pages/acl/index/mutations/createAclRole';

import {
  AclCreateAclRole,
  AclCreateAclRoleVariables,
  AclTableQuery,
  AclUpdateAclMutation,
  AclUpdateAclMutationVariables,
} from 'types/graphql';

import stripRolePrefix from 'components/stripRolePrefix';
import withPage from 'components/withPage';

import ACL_UPDATE_ACL_MUTATION from './mutations/updateAcl';
import ACL_TABLE_QUERY from './queries/aclTable';
import Acl from './Acl';
import aclPageOptions from './pageOptions';
import { OnResourceChangeProps, RowData } from './types';

const AclIndex: React.FC = () => {
  const { data, loading: aclTableLoading } = useQuery<AclTableQuery>(
    ACL_TABLE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const [updateAcl] = useMutation<
    AclUpdateAclMutation,
    AclUpdateAclMutationVariables
  >(ACL_UPDATE_ACL_MUTATION, {
    refetchQueries: ['AclTableQuery'],
    awaitRefetchQueries: true,
  });
  const [addRole, { loading: addRoleLoading }] = useMutation<
    AclCreateAclRole,
    AclCreateAclRoleVariables
  >(ACL_CREATE_ACL_ROLE, {
    refetchQueries: ['AclTableQuery'],
    awaitRefetchQueries: true,
  });
  const { t } = useTranslation(namespaces.pages.acl.index);
  const { enqueueSnackbar } = useSnackbar();

  const columns: Column<RowData>[] = [
    { title: t('resources'), field: 'name', editable: 'never' },
    ...(data?.aclRoles?.map(role => ({
      title: (
        <HeaderCell roleName={stripRolePrefix(role!.name)} roleId={role!.id} />
      ),
      type: 'boolean' as 'boolean',
      field: role?.id,
      filtering: false,
      sorting: false,
    })) || []),
  ];

  const aclResources = [...(data?.aclResources || [])];

  const rows: (any & { name: string; resourceId: string }) | undefined =
    aclResources
      ?.sort((resource1, resource2) => {
        if ((resource1?.name || '') > (resource2?.name || '')) {
          return 1;
        }
        if ((resource1?.name || '') < (resource2?.name || '')) {
          return -1;
        }

        return 0;
      })
      .map(resource => {
        const row: Record<string, any> = {};
        data?.aclRoles?.forEach(role => {
          const roleResource = role?.resources?.find(
            roleResource => roleResource?.id === resource?.id,
          );
          row[role?.id ?? ''] = Boolean(roleResource);
        });

        return { ...row, name: resource?.name, resourceId: resource?.id };
      }) || undefined;

  const resourceChangeHandler = (
    props: OnResourceChangeProps,
  ): Promise<boolean> => {
    let resources: string[] =
      data?.aclRoles
        ?.find(role => role?.id === props.roleId)
        ?.resources?.map(resource => resource?.id || '') || [];

    if (props.value) {
      resources.push(props.resourceId);
    } else {
      resources = resources?.filter(resource => resource !== props.resourceId);
    }

    return updateAcl({
      variables: { input: { id: props.roleId, resources } },
    })
      .then(() => true)
      .catch(() => {
        return false;
      });
  };

  const roleAddHandler = (): void => {
    addRole({ variables: { input: { name: 'ROLE_NEW' } } }).then(() =>
      enqueueSnackbar(t('addSuccess'), { variant: 'success' }),
    );
  };

  return (
    <Acl
      columns={columns}
      rows={rows}
      onResourceChange={resourceChangeHandler}
      onRoleAdd={roleAddHandler}
      loading={aclTableLoading || addRoleLoading}
    />
  );
};

export default withPage(aclPageOptions)(AclIndex);
