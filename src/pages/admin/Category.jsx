import React, { useState, useEffect } from "react";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} from "../../services/categoryService";

function Category() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", categoryName);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (editId !== null) {
      formData.append("id", editId);
      await updateCategory(formData);
    } else {
      await addCategory(formData);
    }

    resetForm();
    loadCategories();
  };

  const resetForm = () => {
    setCategoryName("");
    setImageFile(null);
    setEditId(null);
  };

  const handleEdit = (cat) => {
    setCategoryName(cat.name);
    setEditId(cat.id);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadCategories();
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = categories.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(categories.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h3 className="text-center mb-4">Manage Categories</h3>

          <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm mb-4">
            <div className="mb-3">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImageFile(e.target.files[0])}
                accept="image/*"
                required={editId === null}
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              {editId !== null ? "Update Category" : "Add Category"}
            </button>
          </form>

          {/* {categories.length === 0 ? (
            <div className="alert alert-info text-center">No categories found.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td>{cat.name}</td>
                        <td>
                          {cat.image && (
                            <img
                              src={`http://localhost:8080/images/${cat.image}`}
                              alt={cat.name}
                              className="img-thumbnail"
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEdit(cat)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(cat.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              <nav>
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages).keys()].map((num) => (
                    <li
                      key={num}
                      className={`page-item ${currentPage === num + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => paginate(num + 1)}>
                        {num + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Category;
