import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { getAllCategories } from '../../services/categoryService'; // Import your category service
import axios from 'axios';
import Swal from 'sweetalert2';

const Product = () => {
  const [show, setShow] = useState(false);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        console.log('Fetched Categories:', data);

        if (Array.isArray(data)) {
          setCategories(data); // Set categories if the structure is correct
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    console.log('Selected Category ID:', selectedCategoryId);
  };

  const saveProduct = async (productData) => {
    const formData = new FormData();
    formData.append('p_name', productData.p_name);
    formData.append('p_description', productData.p_description);
    formData.append('category_id', selectedCategory); // Send selected category ID
    formData.append('p_price', productData.p_price);
    formData.append('stock', productData.stock);
    formData.append('image', productData.image); // Image file

    try {
      const response = await axios.post('http://localhost:8080/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added successfully:', response.data);

      // SweetAlert success message
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'Okay',
      }).then(() => {
        // Clear the form and close the modal
        setProduct({
          p_name: '',
          p_price: '',
          p_description: '',
          stock: '',
          category: '',
          image: null,
        });
        setImagePreview(null);
        handleClose();
      });
    } catch (error) {
      console.error('Error adding product:', error);

      // SweetAlert error message
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product:', product);
    console.log('Selected Category:', selectedCategory);

    // Call saveProduct to send the data to the backend
    saveProduct(product);
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleShow}>
        Add Product
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Product Name */}
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="p_name"
                value={product.p_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Price */}
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="p_price"
                value={product.p_price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="p_description"
                value={product.p_description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Stock */}
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Category Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </Form.Select>
            </Form.Group>

            {/* Image Upload */}
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" type="submit">
              Save Product
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
