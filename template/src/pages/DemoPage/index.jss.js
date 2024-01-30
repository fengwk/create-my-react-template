import { createUseStyles } from 'react-jss';

export default createUseStyles({
  helloFont: {
    fontSize: 24,
    fontWeight: (token) => token.fontWeightStrong,
  },
});
