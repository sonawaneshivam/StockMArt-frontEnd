import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { addCategory, getAllCategories, deleteCategory, updateCategory } from '../../services/categoryService';
import Swal from 'sweetalert2';
import Fuse from 'fuse.js';

const Category = () => {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleShow = (category = null) => {
    if (category) {
      setEditCategoryId(category.category_id);
      setCategoryName(category.category_name);
      setCurrentImageUrl(category.image_url);
      setImageFile(null);
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCategoryName('');
    setImageFile(null);
    setEditCategoryId(null);
    setCurrentImageUrl('');
  };

  const handleSubmit = async () => {
    if (!categoryName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in the category name.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('category_name', categoryName);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setLoading(true);

    try {
      if (editCategoryId && !isNaN(editCategoryId)) {
        await updateCategory(editCategoryId, formData);
        Swal.fire({
          icon: 'success',
          title: 'Category Updated',
          text: 'Category was updated successfully.',
        });
      } else {
        await addCategory(formData);
        Swal.fire({
          icon: 'success',
          title: 'Category Added',
          text: 'Category was added successfully.',
        });
      }

      fetchCategories();
      handleClose();
    } catch (error) {
      console.error('Error submitting category', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Submit Category',
        text: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId);
        Swal.fire('Deleted!', 'The category has been deleted.', 'success');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category', error);
        Swal.fire('Error!', 'Something went wrong while deleting the category.', 'error');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔍 Fuse.js fuzzy search
  const fuse = new Fuse(categories, {
    keys: ['category_name'],
    threshold: 0.3,
  });

  const filteredCategories = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : categories;

  // 🔢 Pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCategories.length / categoriesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">

      {/* 🔍 Search Input */}
      <Form.Control
        type="text"
        className="mt-4 w-25"
        placeholder="Search by category name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-4 w-100">
        {/* Adding margin to the left and right of the table */}
        <div className="container">
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No categories found.</td>
                </tr>
              ) : (
                currentCategories.map((category) => (
                  <tr key={category.category_id}>
                    <td>{category.category_name}</td>
                    <td>
                      <img
                        src={category.image_url}
                        alt={category.category_name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <Button variant="warning" className="me-2" onClick={() => handleShow(category)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(category.category_id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Button variant="primary" onClick={() => handleShow()}>Add Category</Button>

      {/* 🔢 Pagination */}
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


      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editCategoryId ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </Form.Group>

            {currentImageUrl && (
              <div className="mb-3 mt-3">
                <Form.Label>Current Image</Form.Label>
                <div style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <img
                    src={currentImageUrl}
                    alt="Current Category"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}

            <Form.Group className="mt-3">
              <Form.Label>Choose New Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;
