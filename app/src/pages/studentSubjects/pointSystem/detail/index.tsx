import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { useTranslation } from 'lib/i18n';
import namespaces from 'lib/i18n/namespaces';

import { getMark, getPercents } from 'components/percentMark';
import ThickDivider from 'components/thickDivider';

import { PointSystemDetailProps } from './types';

const useStyles = makeStyles(() => ({
  cardContent: {
    padding: `0px !important`,
  },
}));

const PointSystemDetail: React.FC<PointSystemDetailProps> = props => {
  const classes = useStyles();
  const { t } = useTranslation(namespaces.pages.studentSubjects.index);

  const CustomCard: React.FC = props => {
    return (
      <Card variant="outlined">
        <CardContent className={classes.cardContent}>
          {props.children}
        </CardContent>
      </Card>
    );
  };

  const numberPercents = getPercents({
    value: props.exam.pointSystem?.points || 0,
    max: props.exam.pointSystem?.maxPoints || 0,
  });
  let percents = '-';
  if (props.exam.pointSystem?.maxPoints !== 0) percents = `${numberPercents}%`;

  let mark = 5;
  if (props.subject.percentsToMarkConvert) {
    mark = getMark({
      percents: numberPercents,
      percentsToMarkConvert: props.subject.percentsToMarkConvert,
    });
  }

  return (
    <>
      <Typography variant="h3">
        {t('pointSystem.personalEvaluation')}
      </Typography>
      <ThickDivider />
      <Box pt={2} />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CustomCard>
            <Typography variant="subtitle2">
              {t('common:gqlObjects.point.points.nominative').toUpperCase()}
            </Typography>
            <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
              <Typography variant="h4">
                {props.exam.pointSystem?.points}
              </Typography>
              <Box pb={0.4} pl={0.8}>
                <Typography>
                  {`z ${props.exam.pointSystem?.maxPoints}`}
                </Typography>
              </Box>
            </Box>
          </CustomCard>
        </Grid>
        <Grid item xs={4}>
          <CustomCard>
            <Typography variant="subtitle2">
              {t('common:gqlObjects.point.percents').toUpperCase()}
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h4">{percents}</Typography>
            </Box>
          </CustomCard>
        </Grid>
        <Grid item xs={4}>
          <CustomCard>
            <Typography variant="subtitle2">
              {t('common:gqlObjects.point.mark').toUpperCase()}
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h4">{`${mark}`}</Typography>
            </Box>
          </CustomCard>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Typography variant="h3">
          {t('pointSystem.comparisonToClass')}
        </Typography>
        <ThickDivider />
        <Box pt={2} />

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CustomCard>
              <Typography variant="subtitle2">
                {t('pointSystem.classPointAverage').toUpperCase()}
              </Typography>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Typography variant="h4">
                  {props.exam.pointSystem?.average}
                </Typography>
                <Box pb={0.4} pl={0.8}>
                  <Typography>
                    {`z ${props.exam.pointSystem?.maxPoints}`}
                  </Typography>
                </Box>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={4}>
            <CustomCard>
              <Typography variant="subtitle2">
                {t('common:gqlObjects.point.percentil').toUpperCase()}
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="h4">{`${props.exam.pointSystem?.percentil}`}</Typography>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={4}>
            <CustomCard>
              <Typography variant="subtitle2">
                {t('pointSystem.studentsBetterThanYou').toUpperCase()}
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="h4">
                  {`${props.exam.pointSystem?.worstThan}`}
                </Typography>
              </Box>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PointSystemDetail;
