import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Button from '@material-ui/core/Button';

import useStyles from './useStyles';

const DEFAULT_CROP_PARAMS = {
  unit: '%',
  x: 15,
  y: 15,
  width: 70,
  height: 70,
};

function ImageUpload({ cropStyles, onUpload }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [cropParams, changeCropParams] = useState(DEFAULT_CROP_PARAMS);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const styles = useStyles();

  const handleLoadFile = (event) => {
    const [file] = event.target.files;

    if (!file?.type.startsWith('image/')) return;

    const fileReader = new FileReader();

    fileReader.onload = () => setImageSrc(fileReader.result);
    fileReader.readAsDataURL(file);
    fileRef.current = file;
  };

  const handleCropChange = (_, newCropParams) => changeCropParams(newCropParams);

  const onImageLoad = () => setImageLoaded(true);

  const getActualCropParameters = (width, height, params) => ({
    cropX: (params.x * width) / 100,
    cropY: (params.y * height) / 100,
    cropWidth: (params.width * width) / 100,
    cropHeight: (params.height * height) / 100,
  });

  const handleSave = async () => {
    const { naturalWidth: width, naturalHeight: height } = imageRef.current;
    const actualCropParams = getActualCropParameters(width, height, cropParams);

    setSaving(true);
    await onUpload({ ...actualCropParams, image: fileRef.current });
    setSaving(false);
  };

  return imageSrc ? (
    <div className={styles.cropContainer}>
      <ReactCrop className={cropStyles} crop={cropParams} onChange={handleCropChange} keepSelection>
        <img src={imageSrc} alt="Crop me" onLoad={onImageLoad} ref={imageRef} />
      </ReactCrop>
      <Button
        className={styles.saveBtn}
        variant="contained"
        size="small"
        color="primary"
        disabled={!isImageLoaded || isSaving}
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  ) : (
    <label htmlFor="imageUpload">
      <Button variant="contained" size="small" color="primary" component="span">
        Add Image
      </Button>
      <input accept="image/*" id="imageUpload" type="file" hidden onChange={handleLoadFile} />
    </label>
  );
}

ImageUpload.propTypes = {
  cropStyles: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
};

ImageUpload.defaultProps = {
  cropStyles: '',
};

export default ImageUpload;
