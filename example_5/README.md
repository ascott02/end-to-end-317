# Example 5 — JWT-Protected Routes

Extends the registration/login flow by issuing signed JSON Web Tokens for stateless authentication.

## Setup

### From scratch

```bash
mkdir jwt_auth
cd jwt_auth
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
```

### Database commands

```bash
createdb registration_login
psql -d registration_login -f schema.sql
```

```sql
CREATE DATABASE registration_login;
\c registration_login
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL
);
```

### Environment file

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials and set a strong `JWT_SECRET` value.

### Run this example in this repo

```bash
npm install
npm start
```

## Test Flow

1. Register a user:
   ```bash
   curl -X POST -d "username=alice&password=secret" http://localhost:3000/auth/register
   ```
2. Log in to receive a token:
   ```bash
   curl -X POST -d "username=alice&password=secret" http://localhost:3000/auth/login
   ```
3. Use the token on a protected route:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:3000/auth/profile
   ```

The `Authorization` header must accompany every request to protected resources.
