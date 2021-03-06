import React, { useEffect, useState } from 'react';

import { useLazyQuery, useQuery } from '@apollo/client';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { compose } from 'recompose';

import routes from 'config/routes';

import withApollo from 'lib/apollo/withApollo';
import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';
import withNamespaces from 'lib/i18n/withNamespaces';
import useTour from 'lib/reactour';

import loginNamespaces from 'pages/login/index/namespaces';

import {
  LoginGetTokenQuery,
  LoginGetTokenQueryVariables,
  LoginMeUserQuery,
  LoginPingQuery,
} from 'types/graphql';

import LOGIN_GET_TOKEN_QUERY from './queries/getToken';
import LOGIN_ME_USER_QUERY from './queries/meUser';
import LOGIN_PING_QUERY from './queries/ping';
import Login from './Login';
import loginTour from './tour';

const LoginIndex: React.FC = () => {
  useQuery<LoginPingQuery>(LOGIN_PING_QUERY);
  const [
    getToken,
    { data: getTokenData, loading: getTokenLoading },
  ] = useLazyQuery<LoginGetTokenQuery, LoginGetTokenQueryVariables>(
    LOGIN_GET_TOKEN_QUERY,
    {
      fetchPolicy: 'no-cache',
    },
  );
  const { data: meUserData, error: meUserError } = useQuery<LoginMeUserQuery>(
    LOGIN_ME_USER_QUERY,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
  );

  const [automaticallyLogged, setAutomaticallyLogged] = useState(false);
  const router = useRouter();
  const tour = useTour();
  const { t } = useTranslation(namespaces.pages.login.index);

  useEffect(() => {
    tour.start({
      steps: loginTour,
      defaultNamespace: namespaces.pages.login.index,
    });
  }, []);

  const submitHandler = (email: string, password: string): void => {
    cookie.remove(`${process.env.NEXT_PUBLIC_TOKEN_COOKIE}`);
    getToken({ variables: { email, password } });
  };

  const { enqueueSnackbar } = useSnackbar();

  const automaticallyLogIn = (): void => {
    if (!automaticallyLogged) {
      setAutomaticallyLogged(true);
      router.push(routes.dashboard.index);
      enqueueSnackbar(t('automaticLogin'), {
        variant: 'success',
      });
    }
  };

  if (meUserData?.meUser && !meUserError) {
    automaticallyLogIn();
  }

  if (!getTokenLoading) {
    if (getTokenData?.getToken) {
      enqueueSnackbar(t('success'), { variant: 'success' });
      cookie.set(
        `${process.env.NEXT_PUBLIC_TOKEN_COOKIE}`,
        getTokenData.getToken.token,
      );
      router.push(routes.dashboard.index);
    }
  }

  return (
    <>
      <Login onSubmit={submitHandler} loading={getTokenLoading} />
    </>
  );
};
export default compose(withNamespaces(loginNamespaces), withApollo)(LoginIndex);
