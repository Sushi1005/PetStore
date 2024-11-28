async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();

        const tbody = document.getElementById('category-list');
        tbody.innerHTML = ''; // Clear any existing content

        categories.forEach(category => {
            const row = `<tr>
                <td>${category.name}</td>
                <td>${category.description || '-'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="showEditCategoryForm('${category._id}', '${category.name}', '${category.description || ''}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category._id}')">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function showAddCategoryForm() {
    document.getElementById('categoryFormFields').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('modalTitle').innerText = 'Add Category';
    document.getElementById('categoryForm').style.display = 'block';
}

function showEditCategoryForm(id, name, description) {
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryDescription').value = description;
    document.getElementById('modalTitle').innerText = 'Edit Category';
    document.getElementById('categoryForm').style.display = 'block';
}

function hideCategoryForm() {
    document.getElementById('categoryForm').style.display = 'none';
}

async function saveCategory() {
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;

    const category = { name, description };

    try {
        const method = id ? 'PUT' : 'POST';
        const endpoint = id
            ? `http://localhost:3000/api/categories/${id}`
            : 'http://localhost:3000/api/categories';

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        hideCategoryForm();
        fetchCategories();
    } catch (error) {
        console.error('Error saving category:', error);
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return; // Abort if the user cancels
    }

    try {
        const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Category deleted successfully.');
        fetchCategories(); // Refresh category list
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete the category. Check the console for details.');
    }
}


// Load categories on page load
fetchCategories();

// Input validation
function validateCategoryForm() {
    const categoryNameField = document.getElementById('categoryName');
    const categoryDescriptionField = document.getElementById('categoryDescription');
    let isValid = true;

    // Validate Category Name (only letters and spaces)
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(categoryNameField.value)) {
        categoryNameField.classList.add('is-invalid');
        isValid = false;
    } else {
        categoryNameField.classList.remove('is-invalid');
    }

    // Validate Description (check for empty or valid input)
    if (!categoryDescriptionField.checkValidity()) {
        categoryDescriptionField.classList.add('is-invalid');
        isValid = false;
    } else {
        categoryDescriptionField.classList.remove('is-invalid');
    }

    return isValid;
}

function saveCategory() {
    if (validateCategoryForm()) {
        alert('Category saved successfully!');
        hideCategoryForm();
    } else {
        alert('Please fix the errors in the form.');
    }
}