import React from 'react';

import { Box, Button, Typography } from '@material-ui/core';
import Link from 'next/link';

import routes from 'config/routes';

import OverlayLoading from 'components/OverlayLoading';
import OverlayLoadingContainer from 'components/OverlayLoading/OverlayLoadingContainer';

import { SummaryProps } from './types';

const Summary: React.FC<SummaryProps> = props => {
  return (
    <OverlayLoadingContainer>
      <OverlayLoading loading={props.loading} />
      <Typography variant="h6">
        {props.classGroup ? 'ClassGroup' : 'Group'}
      </Typography>
      <Typography>
        {`${props.group?.year || ''} ${props.group?.section}`}
      </Typography>
      <Typography variant="h6">Teacher</Typography>
      <Typography>
        {`${props.teacher?.firstname || ''} ${props.teacher?.lastname}`}
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <Box pr={2}>
          <Link href={routes.subjects.index} passHref>
            <Button color="primary">Cancel</Button>
          </Link>
        </Box>
        <Button color="primary" variant="contained" onClick={props.onSubmit}>
          Add
        </Button>
      </Box>
    </OverlayLoadingContainer>
  );
};

export default Summary;