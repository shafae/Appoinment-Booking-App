
# 🏥 Appointment Booking System (NestJS + MongoDB)

A RESTful API where **service providers (doctors)** offer time slots and **users** can book appointments. Built using **NestJS**, **MongoDB**, and **JWT authentication**, with role-based access, email reminders, and cron jobs.

---

## 🚀 Features

- ✅ User & Provider Authentication (JWT)
- ✅ Role-based access control
- ✅ Providers can create/update/delete time slots
- ✅ Users can view and book available slots
- ✅ Users can cancel their own bookings
- ✅ Providers can view booked slots
- ✅ Cron job to send email reminders 30 min before appointments
- ✅ Dockerized with MongoDB support
- ✅ Postman collection for easy testing

---

## 📦 API Endpoints

### 🔐 Authentication

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| POST   | `/auth/signup` | Register as user/provider |
| POST   | `/auth/login`  | Login and get JWT token  |

**Signup Example**
```json
{
  "name": "Dr. Smith",
  "email": "drsmith@example.com",
  "password": "securePass123",
  "role": "provider"
}
```

**Login Example**
```json
{
  "email": "drsmith@example.com",
  "password": "securePass123"
}
```

---

### 📅 Slot Management (Provider Only)

| Method | Endpoint         | Description                   |
|--------|------------------|-------------------------------|
| POST   | `/slots`         | Create a slot                 |
| GET    | `/slots/mine`    | View own slots                |
| PATCH  | `/slots/:id`     | Update own slot               |
| DELETE | `/slots/:id`     | Delete own slot               |

**Slot Body**
```json
{
  "date": "2025-05-01",
  "startTime": "10:30",
  "endTime": "10:40"
}
```

---

### 🔍 View Slots (Users)

| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/slots/available`         | View all available slots             |
| GET    | `/slots/available?providerId=xyz` | Filter available slots by provider |

---

### 📆 Appointment Management

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | `/appointments/book`             | Book an available slot            |
| DELETE | `/appointments/cancel/:id`       | Cancel your appointment           |
| GET    | `/appointments/me`               | View your appointments            |
| GET    | `/appointments/provider`         | Provider: View appointments booked on their slots |

**Booking Example**
```json
{
  "slotId": "6630ae33a8d11590b7ef9b5f"
}
```

---

## 🔒 Auth Header

All protected endpoints require this header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🕒 Cron Job Features

| Task               | Runs Every | Description                              |
|--------------------|------------|------------------------------------------|
| Email Reminders    | 10 minutes | Send reminder emails 30 minutes before appointment |
| Expiry Cleanup     | (optional) | Mark past appointments as expired        |

---

## 🛠 Environment Variables

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/appointment-app
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

---

## 🧪 Postman Collection

Import the included Postman collection JSON (see `/docs/postman-collection.json`) to test all routes easily.

---

## 🐳 Docker Setup

### Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - MONGO_URI=mongodb://mongo:27017/appointment-app
      - JWT_SECRET=your_jwt_secret
      - EMAIL_USER=your-email@gmail.com
      - EMAIL_PASS=your-email-app-password
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

To run:
```bash
docker-compose up --build
```

---

## 🧰 Tech Stack

- NestJS
- MongoDB + Mongoose
- JWT + Role Guards
- Nodemailer + Cron Scheduler
- Docker + Compose

---

## 📣 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
