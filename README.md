# 🌱 EnviroMat - Sustainable Waste Management Platform

<div align="center">
  <img src="frontend/public/Logo.png" alt="EnviroMat Logo" width="200"/>
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-blue.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 🚀 About EnviroMat

EnviroMat is a revolutionary digital platform transforming waste management in West Bengal, India, by connecting waste sellers with sustainable material buyers through an innovative **credit-based circular economy**. Our mission is to make recycling profitable, accessible, and community-driven while promoting sustainable consumption patterns.

### 🎯 Vision
To create a sustainable future where waste becomes a valuable resource, empowering communities through technology-driven environmental solutions.

## ✨ Core Features

### 🔄 Waste-to-Credit System
- **Smart Waste Categorization**: Upload images of waste materials (plastic, paper, metal, organic)
- **AI-Powered Recognition**: Automatic waste type identification using Google Generative AI
- **Credit Rewards**: Earn credits based on waste type, quantity, and quality
- **Doorstep Pickup**: Schedule convenient pickups at your location

### 🛒 Sustainable E-commerce
- **Eco-Friendly Marketplace**: Curated collection of sustainable products
- **Credit Payment System**: Use earned credits or traditional payment methods
- **Product Categories**: Recycled materials, upcycled goods, and eco-friendly alternatives

### 👥 Community Platform
- **Environmental Blog**: Share waste management journeys and success stories
- **Community Engagement**: Connect with like-minded environmental enthusiasts
- **Educational Content**: Learn about sustainable practices and environmental impact

### 📍 Smart Pickup Services
- **Flexible Scheduling**: Standard (2-4 days) and urgent (10-30 minutes) pickup options
- **Real-time Tracking**: Live location updates for pickup requests
- **Route Optimization**: Efficient pickup routes for waste collectors
- **Emergency Requests**: Instant pickup for urgent waste disposal needs

### 📊 Analytics Dashboard
- **Personal Impact Metrics**: Track your environmental contribution
- **Credit History**: Detailed transaction and earning records
- **Waste Trends**: Analyze your waste generation patterns
- **Performance Analytics**: For pickup personnel and businesses

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18.3.1 with Vite
- **Styling**: TailwindCSS 4.1.11
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 7.7.1
- **Charts**: Chart.js & React-ChartJS-2
- **Animations**: Framer Motion & GSAP
- **UI Components**: Lucide React Icons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & bcrypt
- **File Upload**: Cloudinary integration
- **Email Service**: Nodemailer
- **AI Integration**: Google Generative AI
- **Validation**: Validator.js

### DevTools & Utilities
- **Build Tool**: Vite
- **Linting**: ESLint
- **Package Manager**: npm
- **Environment**: dotenv
- **Scheduling**: node-schedule

## 🏗 Project Structure

```
EnviroMat/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & validation
│   │   ├── config/         # Database & cloud configuration
│   │   ├── utils/          # Utility functions
│   │   └── mail/           # Email templates
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── slices/         # Redux slices
│   │   └── utils/          # Helper utilities
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subratamondalnsec/EnviroMat.git
   cd EnviroMat
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create .env file with required variables
   cp .env.example .env
   # Add your MongoDB URI, JWT secrets, Cloudinary config, etc.
   
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:4000`

### Environment Variables

Create a `.env` file in the Backend directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Server
PORT=4000
NODE_ENV=development
```

## 👨‍💻 User Roles

### 🏠 Household Users
- Upload and categorize waste materials
- Schedule pickup appointments
- Earn and spend credits
- Track environmental impact
- Participate in community discussions

### 🚚 Waste Pickers
- Receive pickup requests
- Manage collection routes
- Track earnings and performance
- Handle emergency requests
- Access analytics dashboard

### 🏢 Recycling Businesses
- Purchase collected materials
- Manage inventory
- Track supply chain
- Analytics and reporting

## 📱 Key Features Showcase

### Waste Upload & Recognition
- **Image-based waste identification**
- **Automatic categorization using AI**
- **Credit calculation based on waste type**
- **Quality assessment and verification**

### Smart Pickup System
- **Real-time location tracking**
- **Route optimization algorithms**
- **Emergency pickup handling**
- **Performance analytics for pickers**

### Credit Economy
- **Dynamic credit pricing**
- **Secure transaction system**
- **Credit transfer capabilities**
- **Reward multipliers for consistent users**

### Community Engagement
- **Blog platform for sharing experiences**
- **Environmental impact tracking**
- **Achievement badges and leaderboards**
- **Educational content and tips**

## 🎨 UI/UX Highlights

- **Mobile-First Design**: Responsive across all devices
- **Dark/Light Mode**: User preference-based theming
- **Smooth Animations**: Enhanced user experience with GSAP & Framer Motion
- **Intuitive Navigation**: Easy-to-use interface for all user types
- **Real-time Updates**: Live notifications and status updates

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### Waste Management
- `POST /api/waste/upload` - Upload waste images
- `GET /api/waste/categories` - Get waste categories
- `POST /api/waste/pickup-request` - Schedule pickup
- `GET /api/waste/history` - User's waste history

### Orders & Credits
- `GET /api/orders` - User orders
- `POST /api/orders/create` - Create new order
- `GET /api/credits/balance` - Check credit balance
- `POST /api/credits/transfer` - Transfer credits

## 🤝 Contributing

We welcome contributions to EnviroMat! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

Please use [GitHub Issues](https://github.com/subratamondalnsec/EnviroMat/issues) to report bugs or request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Environmental Inspiration**: Dedicated to creating a sustainable future
- **Community Support**: Thanks to all early adopters and contributors
- **Technology Partners**: Google AI, Cloudinary, MongoDB
- **Open Source**: Built with amazing open-source technologies

## 📞 Contact & Support

- **Email**: support@enviromat.com
- **GitHub**: [@subratamondalnsec](https://github.com/subratamondalnsec)
- **Project Repository**: [EnviroMat](https://github.com/subratamondalnsec/EnviroMat)

---

<div align="center">
  <p>Made with ❤️ for a sustainable future</p>
  <p>🌱 <strong>EnviroMat - Where Waste Becomes Wealth</strong> 🌱</p>
</div>
