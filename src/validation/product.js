import { string, object } from 'yup';

const productSchema = object({
    id: string()
      .required('Mã sản phẩm không được để trống')
      .matches(/^[a-zA-Z0-9]+$/, 'Mã sản phẩm chỉ được chứa chữ và số')
      .min(1, 'Mã sản phẩm phải có ít nhất 1 ký tự'),
  
    name: string()
      .required('Tên sản phẩm không được để trống'),
  
    image: string()
      .required('Ảnh không được để trống'),
  
    price: string()
      .required('Giá tiền không được để trống')
      .matches(/^\d+$/, 'Giá chỉ được nhập số'),
  });  

export default productSchema;