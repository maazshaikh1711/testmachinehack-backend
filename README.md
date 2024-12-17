# README for Social Media Platform

## Project Overview
This is a simple social media platform where users can:
- Sign up and log in using JWT authentication.
- Create posts with text and optional image uploads.
- Comment on posts.
- View a real-time feed of posts and comments. (Ongoing Task)

### Key Features
- **User Authentication**: Secure login and registration with JWT.
- **Post Creation**: Add captions and upload images (stored in Amazon S3) (Upcoming Task).
- **Commenting**: Add comments on posts.
- **Real-Time Updates**: Posts and comments update live using Socket.io and Redis. (Ongoing Task)
- **Data Persistence**: Metadata is stored in MongoDB.
- **API Documentation**: Endpoints documented using Swagger.

---

## Backend Repository

### Prerequisites
1. **Node.js** (version 14.x or above)
2. **MongoDB** (running locally or using a cloud service like MongoDB Atlas)
3. **Redis** (ongoing Task)
4. **Amazon S3** credentials for image uploads (Upcoming Task)

### Environment Variables
Create a `.env` file in the root directory of the backend project with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/maazshaikh1711/testmachinehack-backend.git
   cd backend_repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run start
   ```

The backend will be running at `http://localhost:5000/`.
