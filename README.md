# Electronics Ecommerce Project

A full-stack electronics ecommerce platform built with React.js frontend and Node.js backend.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse electronics by categories with advanced filtering
- **Search Functionality**: Real-time search with category filtering
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Login/Register with JWT authentication
- **Order Management**: Place orders and track order history
- **Wishlist**: Save favorite products
- **Product Reviews**: Rate and review products
- **Notifications**: Real-time notifications for orders and updates
- **Responsive Design**: Mobile-first responsive design

### Admin Features
- **Dashboard**: Analytics and overview of store performance
- **Product Management**: Add, edit, delete products with variants
- **Category Management**: Manage product categories
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer accounts
- **Stock Management**: Track inventory and stock alerts
- **Coupon Management**: Create and manage discount coupons
- **Review Management**: Moderate product reviews
- **Notification System**: Send notifications to users

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Icons** - Icons
- **Chart.js** - Charts for admin dashboard

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Joi** - Validation

## 📁 Project Structure

```
ElectronicsEcommerceProject/
├── Backend/
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   ├── config/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   ├── uploads/
│   ├── .env
│   └── server.js
├── Frontend/
│   ├── src/
│   ├── components/
│   ├── features/
│   ├── assets/
│   └── public/
└── ProjectSystemDesign/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ElectronicsEcommerceProject
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment (.env)**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=electronics_ecommerce
   DB_PORT=3306
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

2. **Frontend Environment (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_APP_NAME=MAA LAXMI STORE
   ```

### Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE electronics_ecommerce;
   ```

2. **Run Database Migrations**
   ```bash
   cd Backend
   npm run migrate
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

## 📱 Usage

### Customer Flow
1. Visit the homepage
2. Browse products by categories
3. Use search functionality to find specific products
4. Add products to cart or wishlist
5. Register/Login to place orders
6. Complete checkout process
7. Track orders in profile section

### Admin Flow
1. Access admin panel at `/admin`
2. Login with admin credentials
3. Manage products, categories, and orders
4. View analytics and reports
5. Handle customer support

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd Frontend
npm test
```

## 📦 Build for Production

### Frontend Build
```bash
cd Frontend
npm run build
```

### Backend Production
```bash
cd Backend
npm start
```

## 🔧 API Documentation

The API follows RESTful conventions with the following main endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Products**: `/api/v1/products/*`
- **Categories**: `/api/v1/categories/*`
- **Cart**: `/api/v1/cart/*`
- **Orders**: `/api/v1/orders/*`
- **Users**: `/api/v1/users/*`
- **Admin**: `/api/v1/admin/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Satyam** - *Initial work*

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- All contributors who helped with this project

## 📞 Support

For support, email support@maalaxmistore.com or create an issue in this repository.

---

**MAA LAXMI STORE** - Your trusted electronics partner 🛒✨
