// Fetch and display all products
async function fetchProducts(categoryFilter = '') {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let products = await response.json();

        // Filter products based on category if a filter is applied
        if (categoryFilter) {
            products = products.filter(product => product.category_id.name === categoryFilter);
        }

        const tbody = document.getElementById('product-list');
        tbody.innerHTML = ''; // Clear existing content

        products.forEach(product => {
            const categoryName = product.category_id ? product.category_id.name : 'Unknown';
            const imageUrl = product.images?.[0] ? product.images[0] : '/images/default.jpg';
            const row = `<tr>
                <td><img src="${imageUrl}" alt="Product Image" style="width: 100px;"></td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${categoryName}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="showEditProductForm('${product._id}', '${product.name}', '${product.description}', ${product.price}, ${product.stock}, '${product.category_id?._id || ''}', '${product.images?.[0]}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Check the console for details.');
    }
}

// Show the Add Product form
function showAddProductForm() {
    document.getElementById('productFormFields').reset(); // Clear the form
    document.getElementById('productId').value = ''; // Clear the hidden ID field
    document.getElementById('modalTitle').innerText = 'Add Product'; // Set modal title
    document.getElementById('productForm').style.display = 'block'; // Show the modal
}

// Show the Edit Product form
function showEditProductForm(id, name, description, price, stock, category, image) {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productDescription').value = description;
    document.getElementById('productPrice').value = price;
    document.getElementById('productStock').value = stock;
    document.getElementById('productCategory').value = category;
    document.getElementById('productImage').value = ''; // Clear file input
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productForm').style.display = 'block'; // Show the modal
}

// Hide the Add/Edit Product form
function hideProductForm() {
    document.getElementById('productForm').style.display = 'none'; // Hide the modal
}

// Input price validation
function validatePrice() {
    const productPriceField = document.getElementById('productPrice');
    let isValid = true;

    // Validate Product Price (must be non-negative)
    if (productPriceField.value < 0 || productPriceField.value === "") {
        productPriceField.classList.add('is-invalid');
        isValid = false;
    } else {
        productPriceField.classList.remove('is-invalid');
    }

    return isValid;
}

// Save the product (Add or Edit)
async function saveProduct() {
    // Call validatePrice and stop if it returns false
    if (!validatePrice()) {
        alert('Please enter a valid price (non-negative).');
        return;
    }
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value, 10);
    const category_id = document.getElementById('productCategory').value;
    const imageFile = document.getElementById('productImage').files[0];

    // Validate inputs
    if (!name || !description || isNaN(price) || !category_id) {
        alert('Please fill all required fields with valid data.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock || 0);
    formData.append('category_id', category_id);

    // Include the image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const endpoint = id
            ? `http://localhost:3000/api/products/${id}`
            : 'http://localhost:3000/api/products';

        const response = await fetch(endpoint, {
            method,
            body: formData // Send form data for file upload
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        hideProductForm();
        fetchProducts(); // Refresh products list
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save the product. Check the console for details.');
    }
}

// Populate categories dropdown
async function populateCategoryDropdown() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();

        const dropdown = document.getElementById('categoryFilter');
        dropdown.innerHTML = ''; // Clear existing options

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name; // Set category name as value for filtering
            option.textContent = category.name; // Display category name
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Handle filter change
document.getElementById('categoryFilter').addEventListener('change', function () {
    const selectedCategory = this.value;
    fetchProducts(selectedCategory); // Fetch products with selected category
});

// Delete a product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return; // Abort if the user cancels
    }

    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Product deleted successfully.');
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product. Check the console for details.');
    }
}

// Initialize the page
populateCategoryDropdown();
fetchProducts();  // Initially fetch and display all products
function clearFilter() {
    // Reset the filter dropdown to 'All Categories'
    document.getElementById("categoryFilter").value = "";

    // Call the filterProducts function to show all products again
    fetchProducts(); 
}