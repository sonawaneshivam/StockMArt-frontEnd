import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getAllCategories } from '../../services/categoryService';
import { getAllProducts } from '../../services/productService';

const Product = () => {
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    p_name: '',
    p_price: '',
    p_description: '',
    stock: '',
    category: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => setShow(true);

  const resetForm = () => {
    setProduct({
      p_name: '',
      p_price: '',
      p_description: '',
      stock: '',
      category: '',
      image: null,
    });
    setSelectedCategory('');
    setImagePreview(null);
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Invalid categories:', data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const saveProduct = async (productData) => {
    const formData = new FormData();
    formData.append('p_name', productData.p_name);
    formData.append('p_description', productData.p_description);
    formData.append('category_id', selectedCategory);
    formData.append('p_price', productData.p_price);
    formData.append('stock', productData.stock);
    formData.append('image', productData.image);

    try {
      await axios.post('http://localhost:8080/product/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire('Success!', 'Product added successfully!', 'success');
      fetchProducts(); // Refresh the product list
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error!', 'Failed to add product.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct(product);
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleShow}>Add Product</Button>

      {/* Modal for adding product */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" name="p_name" value={product.p_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="p_price" value={product.p_price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="p_description" value={product.p_description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={product.stock} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={selectedCategory} onChange={handleCategoryChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px' }} />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="success">Save Product</Button>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Table to display products */}
      <div className="mt-5">
        <h4>Product List</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.name}</td>
                  <td>
                    <img
                      src={prod.product_image_url}
                      alt={prod.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>₹{prod.price}</td>
                  <td>{prod.quantity}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2">Edit</Button>
                    <Button variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No products available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Product;
