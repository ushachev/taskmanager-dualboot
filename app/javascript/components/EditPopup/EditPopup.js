import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';

import Form from 'components/Form';
import ImageUpload from 'components/ImageUpload';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

function EditPopup({ cardId, getCard, onClose, onCardDestroy, onCardUpdate, onAttachImage, onRemoveImage }) {
  const [task, setTask] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [isImageRemoving, setImageRemoving] = useState(false);
  const [errors, setErrors] = useState({});
  const styles = useStyles();

  useEffect(async () => {
    const card = await getCard(cardId);
    setTask(card);
  }, []);

  const handleCardUpdate = () => {
    setSaving(true);

    try {
      onCardUpdate(task);
    } catch (error) {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        alert(`Update Failed! Error: ${error.message}`);
      }
    }
  };

  const handleCardDestroy = () => {
    setSaving(true);

    try {
      onCardDestroy(task);
    } catch (error) {
      setSaving(false);
      alert(`Destrucion Failed! Error: ${error.message}`);
    }
  };

  const handleImageUpload = async (attachment) => {
    try {
      const taskWithImage = await onAttachImage(cardId, attachment);
      setTask(taskWithImage);
    } catch (error) {
      alert(`Upload Failed! Error: ${error.message}`);
    }
  };

  const handleImageRemove = async () => {
    setImageRemoving(true);

    try {
      const taskWithoutImage = await onRemoveImage(cardId);
      setTask(taskWithoutImage);
      setImageRemoving(false);
    } catch (error) {
      alert(`Removing image Failed! Error: ${error.message}`);
      setImageRemoving(false);
    }
  };

  const isLoading = isNil(task);
  const previewSrc = TaskPresenter.imageUrl(task);

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={
            isLoading
              ? 'Your task is loading. Please be patient.'
              : `Task # ${TaskPresenter.id(task)} [${TaskPresenter.name(task)}]`
          }
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <Form errors={errors} onChange={setTask} task={task} />
              {isNil(previewSrc) ? (
                <div className={styles.imageUploadContainer}>
                  <ImageUpload cropStyles={styles.imageUpload} onUpload={handleImageUpload} />
                </div>
              ) : (
                <div className={styles.previewContainer}>
                  <img className={styles.preview} src={previewSrc} alt="Attachment" />
                  <Button
                    disabled={isImageRemoving}
                    className={styles.removeBtn}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleImageRemove}
                  >
                    Remove image
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardUpdate}
            size="small"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardDestroy}
            size="small"
            variant="contained"
            color="secondary"
          >
            Destroy
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

EditPopup.propTypes = {
  cardId: PropTypes.number.isRequired,
  getCard: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardDestroy: PropTypes.func.isRequired,
  onCardUpdate: PropTypes.func.isRequired,
  onAttachImage: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
};

export default EditPopup;
