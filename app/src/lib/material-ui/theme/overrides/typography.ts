import { Overrides } from '@material-ui/core/styles/overrides';

import palette from '../palette';
import spacing from '../spacing';

const h2 = {
  fontSize: '1.25rem',
  fontWeight: 500,
  lineHeight: '1.6',
  letterSpacing: '0.0075em',
};

const typography: Overrides = {
  MuiTypography: {
    h1: {
      // prettier-ignore
      fontSize: '1.5rem',
      letterSpacing: '0em',
      lineHeight: 1.334,
      fontWeight: 400,
      paddingBottom: spacing,
    },
    h2,
    h3: {
      fontSize: '1.25rem',
      fontWeight: 450,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      color: palette!.primary.main,
      paddingLeft: spacing * 3,
      paddingBottom: spacing,
    },
    h6: h2,
    subtitle1: {
      fontWeight: 'bold',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.04em',
      wordSpacing: '0.1em',
    },
  },
  MuiButton: {
    label: {
      letterSpacing: '0.05em',
    },
  },
};

export default typography;
