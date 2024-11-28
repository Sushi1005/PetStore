let ordersData = [];

// Fetch and display all orders
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ordersData = await response.json();
        displayOrders();
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Filter orders based on selected status
function filterOrdersByStatus(status) {
    return ordersData.filter(order => !status || order.status === status);
}

// Apply filter
function applyFilter() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const filteredOrders = filterOrdersByStatus(statusFilter);
    displayOrders(filteredOrders);
}

// Sort orders by date or price
function sortOrders(criterion) {
    let sortedOrders = [...ordersData];
    if (criterion === 'date') {
        sortedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (criterion === 'price') {
        sortedOrders.sort((a, b) => a.total_price - b.total_price);
    }
    ordersData = sortedOrders;
    displayOrders();
}

// Display orders based on filters and sort
function displayOrders(filteredOrders = ordersData) {
    const tbody = document.getElementById('order-list');
    tbody.innerHTML = '';

    filteredOrders.forEach(order => {
        const user = order.user_id ? order.user_id.name : 'Unknown User';
        const products = order.products.map(
            product => `${product.product_id?.name || 'Unknown Product'} (x${product.quantity})`
        ).join(', ');

        const row = `<tr>
            <td>${user}</td>
            <td>${products}</td>
            <td>${order.total_price}</td>
            <td>${order.status}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showEditOrderForm('${order._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order._id}')">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Populate users dropdown
async function populateUsersDropdown() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        const dropdown = document.getElementById('orderUser');
        dropdown.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.textContent = `${user.name} (${user.email})`;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Populate product dropdowns dynamically
async function populateProductDropdowns() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();

        const productSelects = document.querySelectorAll('.product-select');
        productSelects.forEach((select, index) => {
            const currentValue = select.value;

            select.innerHTML = ''; // Clear existing options

            // Add a placeholder option
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Select Product';
            placeholderOption.disabled = true;
            select.appendChild(placeholderOption);

            // Populate the dropdown with products
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = `${product.name} - $${product.price}`;
                option.dataset.price = product.price;
                select.appendChild(option);
            });

            // Restore the previously selected value (if any) for existing lines
            if (currentValue) {
                select.value = currentValue;
            } else {
                placeholderOption.selected = true;
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Add a new product line
function addProductLine() {
    const productLines = document.getElementById('productLines');
    const newLine = document.createElement('div');
    newLine.classList.add('product-line', 'mb-3');
    newLine.innerHTML = `
        <label for="productSelect" class="form-label">Product</label>
        <select class="form-control product-select"></select>
        <label for="productQuantity" class="form-label">Quantity</label>
        <input type="number" class="form-control product-quantity" min="1" value="1">
        <label for="productPrice" class="form-label">Price</label>
        <input type="number" class="form-control product-price" readonly>
    `;
    productLines.appendChild(newLine);
    populateProductDropdowns();
}

// Save the order (add or update)
async function saveOrder() {
    const form = document.getElementById('orderFormFields');
    const formData = new FormData(form);

    const orderId = document.getElementById('orderId').value;

    const products = [];
    const productLines = document.querySelectorAll('.product-line');
    productLines.forEach((line, index) => {
        const productSelect = line.querySelector('.product-select');
        const productQuantity = line.querySelector('.product-quantity').value;
        const productPrice = line.querySelector('.product-price').value;
        const productId = productSelect.value;

        if (productId) {
            products.push({
                product_id: productId,
                quantity: productQuantity,
                price: productPrice,
            });
        }
    });

    const order = {
        user_id: formData.get('orderUser'),
        status: formData.get('orderStatus'),
        products: products,
        total_price: formData.get('orderTotal'),
        hst: formData.get('hst'),
        createdAt: formData.get('orderDate'),
    };

    try {
        const method = orderId ? 'PUT' : 'POST';
        const url = orderId ? `http://localhost:3000/api/orders/${orderId}` : 'http://localhost:3000/api/orders';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        hideOrderForm();
        fetchOrders();
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

// Show the add/edit order form
function showAddOrderForm() {
    document.getElementById('modalTitle').textContent = 'Add Order';
    document.getElementById('orderForm').style.display = 'block';
    populateUsersDropdown();
    addProductLine(); 
}

// Hide the order form
function hideOrderForm() {
    document.getElementById('orderForm').style.display = 'none';
}

// Show the edit order form
async function showEditOrderForm(orderId) {
    const order = ordersData.find(o => o._id === orderId);
    if (!order) {
        return;
    }

    document.getElementById('modalTitle').textContent = 'Edit Order';
    document.getElementById('orderId').value = orderId;
    document.getElementById('orderStatus').value = order.status;
    document.getElementById('orderTotal').value = order.total_price;
    document.getElementById('hst').value = order.hst;
    document.getElementById('orderDate').value = new Date(order.createdAt).toISOString().slice(0, 16);
    document.getElementById('orderUser').value = order.user_id._id;

    document.getElementById('orderForm').style.display = 'block';

    addProductLine();  
    order.products.forEach((product, index) => {
        const productLine = document.querySelectorAll('.product-line')[index];
        const productSelect = productLine.querySelector('.product-select');
        const productQuantity = productLine.querySelector('.product-quantity');
        const productPrice = productLine.querySelector('.product-price');

        productSelect.value = product.product_id._id;
        productQuantity.value = product.quantity;
        productPrice.value = product.price;
    });
}

// Delete an order
async function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }
}

// Initial fetch of orders when page loads
fetchOrders();