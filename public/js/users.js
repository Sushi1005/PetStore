// Fetch and display all users
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();

        const tbody = document.getElementById('user-list');
        tbody.innerHTML = ''; // Clear any existing content

        users.forEach(user => {
            const row = `<tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.address || '-'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="showEditUserForm('${user._id}', '${user.name}', '${user.email}', '${user.role}', '${user.address || ''}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users. Check console for details.');
    }
}

// Show Add User Form
function showAddUserForm() {
    document.getElementById('userFormFields').reset();
    document.getElementById('userId').value = '';
    document.getElementById('modalTitle').innerText = 'Add User';
    document.getElementById('userForm').style.display = 'block';
}

// Show Edit User Form
function showEditUserForm(id, name, email, role, address) {
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userRole').value = role;
    document.getElementById('userAddress').value = address;
    document.getElementById('modalTitle').innerText = 'Edit User';
    document.getElementById('userForm').style.display = 'block';
}

// Hide User Form
function hideUserForm() {
    document.getElementById('userForm').style.display = 'none';
}

// Save (Add or Edit) User
async function saveUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;
    const address = document.getElementById('userAddress').value.trim();

    // Validate inputs
    if (!name || !email || (!id && !password)) {
        alert('Name, Email, and Password are required.');
        return;
    }

    const user = { name, email, role, address };
    if (!id) user.password = password; // Include password only for new users

    try {
        const method = id ? 'PUT' : 'POST';
        const endpoint = id
            ? `http://localhost:3000/api/users/${id}`
            : 'http://localhost:3000/api/users';

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('User saved successfully.');
        hideUserForm();
        fetchUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save the user. Check console for details.');
    }
}

// Delete User
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('User deleted successfully.');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete the user. Check console for details.');
    }
}

// Load users on page load
fetchUsers();

// Input validations
function validateForm() {
    const emailField = document.getElementById('userEmail');
    const passwordField = document.getElementById('userPassword');
    const nameField = document.getElementById('userName');
    const roleField = document.getElementById('userRole');
    const addressField = document.getElementById('userAddress');

    let isValid = true;

    // Validate Name (letters only)
    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(nameField.value) || !nameField.checkValidity()) {
        nameField.classList.add('is-invalid');
        isValid = false;
    } else {
        nameField.classList.remove('is-invalid');
    }

    // Validate Email (built-in HTML validation)
    if (!emailField.checkValidity()) {
        emailField.classList.add('is-invalid');
        isValid = false;
    } else {
        emailField.classList.remove('is-invalid');
    }

    // Validate Password (min 4 characters)
    if (passwordField.value.length < 4) {
        passwordField.classList.add('is-invalid');
        isValid = false;
    } else {
        passwordField.classList.remove('is-invalid');
    }

    // Validate Role (selection required)
    if (roleField.value === "") {
        roleField.classList.add('is-invalid');
        isValid = false;
    } else {
        roleField.classList.remove('is-invalid');
    }

    // Validate Address (min 10 characters)
    if (!addressField.checkValidity()) {
        addressField.classList.add('is-invalid');
        isValid = false;
    } else {
        addressField.classList.remove('is-invalid');
    }

    return isValid;
}

function saveUser() {
    if (validateForm()) {
        alert('User saved successfully!');
        hideUserForm();
    } else {
        alert('Please fix the errors in the form.');
    }
}