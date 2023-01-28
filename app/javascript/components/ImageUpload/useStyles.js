import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  cropContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },

  saveBtn: {
    marginTop: 8,
  },
}));

export default useStyles;
