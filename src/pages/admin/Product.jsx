import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { deleteProduct, getAllProducts, addProduct } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);

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

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmResult.isConfirmed) {
            try {
                const message = await deleteProduct(id);
                Swal.fire('Deleted!', message, 'success');
                fetchProducts();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the product.', 'error');
            }
        }
    };

    useEffect(() => {
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
        try {
            await addProduct({
                ...productData,
                category_id: selectedCategory,
            });

            Swal.fire('Success!', 'Product added successfully!', 'success');
            fetchProducts();
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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-4">
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
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
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

            {/* Table */}
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
                        {currentProducts.length > 0 ? (
                            currentProducts.map((prod, index) => (
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
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(prod.product_id)}
                                        >
                                            Delete
                                        </Button>
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
                <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" onClick={handleShow}>Add Product</Button>
                </div>
                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        variant="primary"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="me-2"
                    >
                        Prev
                    </Button>
                    {pageNumbers.map((number) => (
                        <Button
                            key={number}
                            variant={number === currentPage ? 'primary' : 'outline-primary'}
                            onClick={() => setCurrentPage(number)}
                            className="me-2"
                        >
                            {number}
                        </Button>
                    ))}
                    <Button
                        variant="primary"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pageNumbers.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Product;
