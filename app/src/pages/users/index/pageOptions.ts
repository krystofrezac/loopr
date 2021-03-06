import helpPaths from 'config/helpPaths';
import resources from 'config/resources';
import routes from 'config/routes';

import namespaces from 'lib/i18n/namespaces';
import materialTableNamespaces from 'lib/material-table/namespaces';

import { Breadcrumbs } from 'components/withPage/Page/AppBar/Breadcrumbs/types';
import { PageOptions } from 'components/withPage/types';

export const usersBreadcrumbs: Breadcrumbs = [
  { label: 'users.index', href: routes.users.index },
];

const usersNamespaces = [
  namespaces.pages.users.index,
  ...materialTableNamespaces,
];

export const usersResources: string[][] = [[resources.user.showAll]];

const usersPageOptions: PageOptions = {
  breadcrumbs: usersBreadcrumbs,
  namespaces: usersNamespaces,
  title: 'users.index',
  helpPath: helpPaths.users.index,
  resources: usersResources,
};

export default usersPageOptions;
