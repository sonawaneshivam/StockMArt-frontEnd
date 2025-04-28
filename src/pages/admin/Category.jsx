import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { addCategory, getAllCategories, deleteCategory } from '../../services/categoryService';
import Swal from 'sweetalert2';  // Import SweetAlert2

const Category = () => {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);  // Ensure categories is initialized as an empty array
  const [loading, setLoading] = useState(false);  // Added loading state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();  // Fetch categories from backend
      console.log(data);
      setCategories(Array.isArray(data) ? data : []);  // Ensure data is an array
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setCategoryName('');
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!categoryName || !imageFile) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in both category name and image.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('image', imageFile);

    setLoading(true);  // Set loading to true when the request starts

    try {
      await addCategory(formData); // 👈 just call service
      Swal.fire({
        icon: 'success',
        title: 'Category Added',
        text: 'Your category has been added successfully!',
      });
      fetchCategories();  // Fetch categories again after successful add
      handleClose();
    } catch (error) {
      console.error("Error adding category", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Category',
        text: 'Something went wrong while adding the category.',
      });
    } finally {
      setLoading(false);  // Set loading to false when the request finishes
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
        await deleteCategory(categoryId);  // Call the service to delete category
        Swal.fire('Deleted!', 'The category has been deleted.', 'success');
        fetchCategories();  // Refresh the categories after deletion
      } catch (error) {
        console.error("Error deleting category", error);
        Swal.fire('Error!', 'Something went wrong while deleting the category.', 'error');
      }
    }
  };

  const renderTable = () => {
    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="text-center">No categories available.</td>
        </tr>
      );
    }

    const rows = [];
    let lastCategoryName = null;
    let rowspanCount = 0;

    categories.forEach((category, index) => {
      // If the category name is the same as the last one, increase rowspan count
      if (category.category_name === lastCategoryName) {
        rowspanCount++;
      } else {
        rowspanCount = 1;  // Reset count for new category name
      }

      rows.push(
        <tr key={category.id}>
          {index === 0 || category.category_name !== lastCategoryName ? (
            <td rowSpan={rowspanCount}>{category.category_name}</td>
          ) : null}
          <td>
            <img
              src={category.image_url} // Display the image URL
              alt={category.category_name}
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          </td>
          <td>
            <Button variant="warning" className="mr-2">Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(category.id)}>
              Delete
            </Button>
          </td>
        </tr>
      );
      lastCategoryName = category.category_name;  // Update the last category name for comparison
    });

    return rows;
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Button variant="primary" onClick={handleShow}>
        Add Category
      </Button>

      {/* Category Table */}
      <div className="mt-4 w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTable()} {/* Render the table rows */}
          </tbody>
        </Table>
      </div>

      {/* Modal for adding category */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
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
            <Form.Group className="mt-3">
              <Form.Label>Choose Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={loading}  // Disable the button while loading
          >
            {loading ? "Submitting..." : "Submit"}  {/* Display loading text */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;
