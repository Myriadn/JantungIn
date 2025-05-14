# JantungIn API

JantungIn API is a RESTful backend service for the JantungIn cardiovascular risk assessment application. This API supports user authentication, patient data management, and cardiovascular risk prediction.

## Features

- User authentication (register, login, profile management)
- Cardiovascular disease risk prediction
- Diagnosis history tracking
- RESTful API with standardized endpoints
- Support for both MySQL and AWS DynamoDB databases

## Tech Stack

- Node.js
- Hapi.js framework
- MySQL/PostgreSQL (for development/testing)
- AWS DynamoDB (for production)
- JWT for authentication

## Prerequisites

- Node.js v14+ and npm
- MySQL or PostgreSQL (for local development)
- AWS account with DynamoDB access (for production)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd JantungIn_API
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to set your database credentials and other configuration options.

## Database Configuration

### Local Development with MySQL/PostgreSQL

1. Set `USE_DYNAMODB=false` in your `.env` file.
2. Configure the SQL database settings:

```
DB_DIALECT=mysql  # or postgres
DB_HOST=localhost
DB_PORT=3306      # 5432 for PostgreSQL
DB_NAME=jantungin
DB_USER=your_username
DB_PASSWORD=your_password
```

### Production with AWS DynamoDB

1. Set `USE_DYNAMODB=true` in your `.env` file.
2. Configure your AWS credentials:

```
AWS_REGION=ap-southeast-1  # or your preferred region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

Make sure your AWS user has permissions to create and manage DynamoDB tables.

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Diagnosis

- `POST /api/diagnosis` - Create a new diagnosis
- `GET /api/diagnosis/history` - Get user's diagnosis history
- `GET /api/diagnosis/{id}` - Get a specific diagnosis

## Testing

```bash
npm test
```

## Deployment

### AWS Deployment Steps

1. Set up an EC2 instance or use AWS Elastic Beanstalk
2. Configure environment variables for production
3. Use DynamoDB for the database in production by setting `USE_DYNAMODB=true`
4. Use a process manager like PM2 to manage the Node.js application

### Docker Deployment

A Dockerfile is included to containerize the application. Build and run with:

```bash
docker build -t jantungin-api .
docker run -p 3000:3000 -e NODE_ENV=production jantungin-api
```

## License

This project is licensed under the ISC License.

## Contributors

- Myriadn - Initial development and API design
