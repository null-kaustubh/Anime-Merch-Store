# Anime Merch Shop

A responsive e-commerce web application for anime merchandise built with Node.js, Express, and Bootstrap. This project demonstrates a simple yet functional online store with product browsing, shopping cart functionality, and checkout process.

## Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Dark Mode**: Toggle between light and dark themes with persistent user preference
- **Product Catalog**: Browse products with category filtering
- **Shopping Cart**: Add, update, and remove items from your cart
- **Checkout Process**: Simple checkout flow with customer information
- **Custom Styling**: Beautiful UI with custom CSS variables and animations
- **Font Customization**: Uses Poppins as the primary font with system font fallbacks

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3 for responsive layout and components
- Font Awesome 6.4 for icons
- Google Fonts (Poppins)

### Backend
- Node.js
- Express.js for server and API routes
- Express Session for cart management
- UUID for generating unique identifiers

## Project Structure

```
├── public/                  # Static files
│   ├── css/                # CSS stylesheets
│   │   └── styles.css      # Custom styles
│   ├── images/             # Product and hero images
│   ├── js/                 # Client-side JavaScript
│   │   └── main.js         # Main application logic
│   └── index.html          # Main HTML file
├── server.js               # Express server and API routes
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd testBootstrapEcom
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Browsing Products
- View all products on the homepage
- Filter products by category using the dropdown menu
- Click on a product to view details

### Shopping Cart
- Add products to your cart from the product listing or detail page
- View your cart by clicking the cart icon in the navigation bar
- Update quantities or remove items in the cart modal
- See the total price of all items in your cart

### Checkout
- Proceed to checkout from the cart modal
- Fill in your shipping information
- Place your order

### Dark Mode
- Toggle dark mode by clicking the moon/sun icon in the navigation bar
- Your preference is saved and will persist between visits

## Development

### Running in Development Mode

Use the following command to run the application with automatic server restarts on code changes:

```
npm run dev
```

### Running in Production Mode

For production deployment, use:

```
npm start
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get a single product by ID
- `GET /api/cart` - Get the current user's cart
- `POST /api/cart` - Add an item to the cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove an item from the cart
- `POST /api/checkout` - Process checkout

## License

This project is licensed under the MIT License.

## Acknowledgements

- Bootstrap for the responsive framework
- Font Awesome for the icons
- Google Fonts for the Poppins font family