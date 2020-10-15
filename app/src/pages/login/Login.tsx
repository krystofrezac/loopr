import React from 'react';

import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import helpPaths from 'config/helpPaths';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import { FormValues, LoginProps } from 'pages/login/types';

import Help from 'components/Help';
import LanguageSelect from 'components/LanguageSelect';
import Link from 'components/Link';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(20),
  },
  form: {
    width: '100%',
  },
}));

const Login: React.FC<LoginProps> = props => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm<FormValues>();
  const { t } = useTranslation(namespaces.pages.login);

  const submitHandler = (values: FormValues): void => {
    props.onSubmit(values.email, values.password);
  };

  return (
    <Container maxWidth="xs">
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box pb={2}>
                <Typography variant="h4" component="h1" color="primary">
                  {t('title')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label={t('email')}
                variant="outlined"
                fullWidth
                autoComplete="email"
                inputRef={register({ required: true })}
                inputProps={{ 'test-id': 'Login-emailInput' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label={t('password')}
                variant="outlined"
                fullWidth
                autoComplete="current-password"
                inputRef={register({ required: true })}
                inputProps={{ 'test-id': 'Login-passwordInput' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                test-id="Login-submitButton"
                tour-id="Login-submitButton"
              >
                {t('logIn')}
              </Button>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={6}>
                <Link href="/index">{t('forgottenPassword')}</Link>
              </Grid>
              <Grid container item xs={6} justify="flex-end">
                <Link href="/index">{t('doNotHaveAccount')}</Link>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Help path={helpPaths.login} size="small" />
            </Grid>
            <Grid item container xs={6} justify="flex-end">
              <LanguageSelect size="small" />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
