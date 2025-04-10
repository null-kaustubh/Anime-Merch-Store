// Main JavaScript for Anime Merch Shop

// Global variables
let products = [];
let currentCategory = 'all';
let currentProduct = null;
let darkMode = localStorage.getItem('darkMode') === 'enabled';


// DOM Elements
const productsContainer = document.getElementById('products-container');
const categoryTitle = document.getElementById('category-title');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartTotal = document.getElementById('cart-total');
const orderTotal = document.getElementById('order-total');
const checkoutBtn = document.getElementById('checkout-btn');
const placeOrderBtn = document.getElementById('place-order-btn');
const productDetailContent = document.getElementById('product-detail-content');
const addToCartDetailBtn = document.getElementById('add-to-cart-detail');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Load all products by default
  loadProducts();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load cart from session
  loadCart();
  
  // Initialize dark mode
  if (darkMode) {
    enableDarkMode();
  }
});

// Set up event listeners
function setupEventListeners() {
  // Category filter links
  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.getAttribute('data-category');
      filterProductsByCategory(category);
    });
  });
  
  // Checkout button
  checkoutBtn.addEventListener('click', () => {
    updateOrderTotal();
  });
  
  // Place order button
  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    placeOrder();
  });
  
  // Add to cart from product detail
  addToCartDetailBtn.addEventListener('click', () => {
    if (currentProduct) {
      addToCart(currentProduct.id, 1);
    }
  });
  
  // Dark mode toggle
  darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    if (darkMode) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
}

// Enable dark mode
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  localStorage.setItem('darkMode', 'enabled');
}

// Disable dark mode
function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  localStorage.setItem('darkMode', 'disabled');

}

// Load all products from API
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    productsContainer.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Failed to load products. Please try again later.</p></div>`;
  }
}

// Filter products by category
function filterProductsByCategory(category) {
  currentCategory = category;
  
  if (category === 'all') {
    displayProducts(products);
    categoryTitle.textContent = 'All Products';
    return;
  }
  
  const filteredProducts = products.filter(product => product.category === category);
  displayProducts(filteredProducts);
  
  // Update category title
  const categoryMap = {
    'manga': 'Manga',
    'poster': 'Posters',
    'clothing': 'Clothing'
  };
  
  categoryTitle.textContent = categoryMap[category] || 'Products';
}

// Display products in the container
function displayProducts(productsToDisplay) {
  if (!productsToDisplay.length) {
    productsContainer.innerHTML = `<div class="col-12 text-center"><p>No products found in this category.</p></div>`;
    return;
  }
  
  productsContainer.innerHTML = productsToDisplay.map(product => `
    <div class="col-md-4 mb-4">
      <div class="card product-card">
        <span class="category-badge category-${product.category}">${product.category}</span>
        <img src="${product.image || '/images/placeholder.jpg'}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold text-danger">₹${product.price.toFixed(2)}</span>
            <div>
              <button class="btn btn-sm btn-outline-secondary view-product" data-product-id="${product.id}" data-bs-toggle="modal" data-bs-target="#productDetailModal">View</button>
              <button class="btn btn-sm btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-product-id');
      addToCart(productId, 1);
    });
  });
  
  document.querySelectorAll('.view-product').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-product-id');
      viewProductDetail(productId);
    });
  });
}

// View product detail
function viewProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  currentProduct = product;
  
  productDetailContent.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${product.image || '/images/placeholder.jpg'}" class="product-detail-image" alt="${product.name}">
      </div>
      <div class="col-md-6">
        <h3>${product.name}</h3>
        <span class="product-detail-category category-${product.category}">${product.category}</span>
        <p class="product-detail-price">₹${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <div class="d-flex align-items-center">
          <label for="detail-quantity" class="me-2">Quantity:</label>
          <input type="number" id="detail-quantity" class="form-control" style="width: 70px" min="1" value="1">
        </div>
      </div>
    </div>
  `;
  
  // Update add to cart button to include quantity
  addToCartDetailBtn.onclick = () => {
    const quantity = parseInt(document.getElementById('detail-quantity').value) || 1;
    addToCart(product.id, quantity);
  };
}

// Add product to cart
async function addToCart(productId, quantity) {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
    
    const cart = await response.json();
    updateCartUI(cart);
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '5';
    toast.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Anime Merch Shop</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Item added to cart successfully!
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add item to cart. Please try again.');
  }
}

// Load cart from session
async function loadCart() {
  try {
    const response = await fetch('/api/cart');
    const cart = await response.json();
    updateCartUI(cart);
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Update cart UI
function updateCartUI(cart) {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items
  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
    cartItems.innerHTML = '';
    checkoutBtn.disabled = true;
  } else {
    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;
    
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" data-product-id="${item.product.id}">
        <img src="${item.product.image || '/images/placeholder.jpg'}" class="cart-item-image" alt="${item.product.name}">
        <div class="cart-item-details">
          <h6 class="cart-item-title">${item.product.name}</h6>
          <p class="cart-item-price">₹${item.product.price.toFixed(2)}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="cart-item-quantity">
              <button class="quantity-decrease">-</button>
              <input type="number" value="${item.quantity}" min="1" max="99" readonly>
              <button class="quantity-increase">+</button>
            </div>
            <span class="cart-item-remove"><i class="fas fa-trash"></i></span>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.quantity-decrease').forEach(button => {
      button.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.getAttribute('data-product-id');
        const quantityInput = cartItem.querySelector('input');
        const newQuantity = parseInt(quantityInput.value) - 1;
        
        if (newQuantity >= 1) {
          updateCartItemQuantity(productId, newQuantity);
        }
      });
    });
    
    document.querySelectorAll('.quantity-increase').forEach(button => {
      button.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.getAttribute('data-product-id');
        const quantityInput = cartItem.querySelector('input');
        const newQuantity = parseInt(quantityInput.value) + 1;
        
        updateCartItemQuantity(productId, newQuantity);
      });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.getAttribute('data-product-id');
        removeFromCart(productId);
      });
    });
  }
  
  // Update cart total
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  cartTotal.textContent = `₹${total.toFixed(2)}`;
}

// Update cart item quantity
async function updateCartItemQuantity(productId, quantity) {
  try {
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
    
    const cart = await response.json();
    updateCartUI(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    alert('Failed to update cart. Please try again.');
  }
}

// Remove item from cart
async function removeFromCart(productId) {
  try {
    const response = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    
    const cart = await response.json();
    updateCartUI(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    alert('Failed to remove item from cart. Please try again.');
  }
}

// Update order total in checkout modal
function updateOrderTotal() {
  const total = cartTotal.textContent;
  orderTotal.textContent = total;
}

// Place order
async function placeOrder() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  
  if (!name || !email || !address) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, address })
    });
    
    if (!response.ok) {
      throw new Error('Checkout failed');
    }
    
    const result = await response.json();
    
    // Close checkout modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    
    // Show order confirmation
    document.getElementById('order-id').textContent = result.order.id;
    const orderConfirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
    orderConfirmationModal.show();
    
    // Reset cart UI
    updateCartUI([]);
    
    // Reset checkout form
    document.getElementById('checkout-form').reset();
    
  } catch (error) {
    console.error('Error during checkout:', error);
    alert('Checkout failed. Please try again.');
  }
}