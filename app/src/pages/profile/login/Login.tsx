import React from 'react';

import { Box, Button, Divider, TextField, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import OverlayLoading from 'components/OverlayLoading';
import OverlayLoadingContainer from 'components/OverlayLoading/OverlayLoadingContainer';
import ThickDivider from 'components/thickDivider';

import { LoginProps, SubmitValues } from './types';

const Login: React.FC<LoginProps> = props => {
  const { register, handleSubmit } = useForm<SubmitValues>();
  const { t } = useTranslation(namespaces.pages.profile.index);

  const submitHandler = (values: SubmitValues): void => {
    props.onSubmit(values);
  };

  return (
    <OverlayLoadingContainer>
      <OverlayLoading loading={props.loading} />
      <Box pt={2}>
        <Typography variant="h3">{t('passwordChange')}</Typography>
        <ThickDivider />
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box display="flex" flexWrap="wrap" flexDirection="column" pl={2}>
            <Box pr={2} pt={2}>
              <TextField
                label={t('oldPassword')}
                type="password"
                name="oldPassword"
                inputRef={register({ required: true })}
              />
            </Box>
            <Box pr={2} pt={2}>
              <TextField
                label={t('newPassword')}
                type="password"
                error={props.notMatch}
                name="newPassword1"
                inputRef={register({ required: true })}
              />
            </Box>
            <Box pr={2} pt={2}>
              <TextField
                label={t('newPasswordAgain')}
                type="password"
                error={props.notMatch}
                name="newPassword2"
                inputRef={register({ required: true })}
              />
            </Box>
          </Box>
          <Box pt={4} pb={2} pl={2}>
            <Button color="primary" variant="contained" type="submit">
              {t('common:actions.change')}
            </Button>
          </Box>
        </form>
        <Divider />
      </Box>
    </OverlayLoadingContainer>
  );
};

export default Login;
