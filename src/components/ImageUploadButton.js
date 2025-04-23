import React, { useRef } from 'react';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const ImageUploadButton = ({ onChange }) => {
  const fileInputRef = useRef();

  const handleImageSelect = (e) => {
    onChange(e);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <label htmlFor="icon-button-file">
      <Input
        accept="image/*"
        id="icon-button-file"
        type="file"
        onChange={handleImageSelect}
        ref={fileInputRef}
      />
      <IconButton color="primary" component="span" sx={{ mt: 1 }}>
        <PhotoCamera />
      </IconButton>
    </label>
  );
};

export default ImageUploadButton;
