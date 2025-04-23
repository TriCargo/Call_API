import React, { useEffect, useState, useCallback } from 'react';
import productSchema from '../src/validation/product';
import {
  Container, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Pagination
} from '@mui/material';
import { getProducts, createProduct, deleteProduct, updateProduct } from './api/productApi';
import { handleImageChange, IMAGE_BASE_URL } from '../src/util/imageUtils';
import ImageUploadButton from '../src/components/ImageUploadButton';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', image: '', price: '' });
  const [imageName, setImageName] = useState('');
  const [errors, setErrors] = useState({
    id: '',
    name: '',
    image: '',
    price: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [totalProducts, setTotalProducts] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      const allProducts = response.data;
      setTotalProducts(allProducts.length);
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = allProducts.slice(startIndex, startIndex + itemsPerPage);
  
      setProducts(paginated);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  }, [currentPage, itemsPerPage]);
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    try {
      await productSchema.validate(updatedForm, { abortEarly: false });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (validationError) {
      if (validationError.inner && validationError.inner.length > 0) {
        const fieldError = validationError.inner.find(err => err.path === name);
        if (fieldError) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError.message }));
        }
      }
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    try {
      await productSchema.validate(updatedForm, { abortEarly: false });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (validationError) {
      if (validationError.inner && validationError.inner.length > 0) {
        const fieldError = validationError.inner.find(err => err.path === name);
        if (fieldError) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError.message }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await productSchema.validate(form, { abortEarly: false });

      if (form.id) {
        await updateProduct(form.id, form);
      } else {
        await createProduct(form);
      }

      setForm({ id: '', name: '', image: '', price: '' });
      setImageName('');
      setErrors({
        id: '',
        name: '',
        image: '',
        price: '',
      });
      loadProducts(currentPage, itemsPerPage);
    } catch (validationError) {
      if (validationError.inner && validationError.inner.length > 0) {
        const errorMessages = validationError.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      }
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setImageName(item.image);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xoá?')) {
      await deleteProduct(id);
      loadProducts(currentPage, itemsPerPage);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    loadProducts(value, itemsPerPage);
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Quản lý Sản phẩm</Typography>

      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="ID"
            name="id"
            value={form.id}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            error={!!errors.id}
            helperText={errors.id}
          />
          <TextField
            label="Tên"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <ImageUploadButton
            onChange={(e) => {
              handleImageChange(e, form, setForm);
              const file = e.target.files[0];
              setImageName(file ? file.name : '');
            }}
          />
          <TextField
            label="Giá"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            error={!!errors.price}
            helperText={errors.price}
          />
          <Button variant="contained" type="submit" disabled={Object.values(errors).some(error => error)}>Lưu</Button>
        </Stack>
        {imageName && <Typography variant="body2" sx={{ mt: 1 }}>Tên ảnh: {imageName}</Typography>}
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <img src={`${IMAGE_BASE_URL}images/${p.image}`} width="60" alt={p.name} />
                </TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => handleEdit(p)}>Sửa</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(p.id)}>Xoá</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(totalProducts / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ mt: 3 }}
      />
    </Container>
  );
}

export default App;