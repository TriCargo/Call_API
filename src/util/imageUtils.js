import axios from 'axios';

export const IMAGE_BASE_URL = "http://localhost:8080/rest/files/";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('files', file);

  const folder = 'images';

  const response = await axios.post(`${IMAGE_BASE_URL}${folder}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data[0];
};

export const handleImageChange = (e, form, setForm) => {
  const file = e.target.files[0];
  if (file) {
    uploadImage(file).then((filename) => {
      setForm({ ...form, image: filename });
    });
  }
};
