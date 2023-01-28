import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,
  },

  root: {
    width: 465,
  },

  loader: {
    display: 'flex',
    justifyContent: 'center',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  imageUploadContainer: {
    paddingTop: 8,
  },

  imageUpload: {
    maxHeight: 250,
  },

  previewContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    paddingTop: 8,
  },

  preview: {
    maxWidth: '100%',
    maxHeight: 250,
  },

  removeBtn: {
    marginTop: 8,
  },
}));

export default useStyles;
