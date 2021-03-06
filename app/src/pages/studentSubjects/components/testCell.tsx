import React from 'react';

import {
  makeStyles,
  TableCell,
  TableCellProps,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: theme.spacing(18),
    borderRight: '1px solid #E0E0E0',
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.25),
  },
}));

const TestCell: React.FC<TableCellProps & { backgroundColor?: string }> = ({
  backgroundColor,
  children,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <TableCell
      padding="none"
      className={classes.root}
      style={{ backgroundColor }}
      {...rest}
    >
      {children}
    </TableCell>
  );
};
export default TestCell;
