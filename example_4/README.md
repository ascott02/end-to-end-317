# Example 4 — Registration and Login (PostgreSQL + bcrypt)

This example introduces a database-backed auth flow using parameterized queries and hashed passwords.

## Setup

### From scratch

```bash
mkdir registration_login
cd registration_login
npm init -y
npm install express pg bcrypt dotenv
mkdir public routes
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

Edit the copied `.env` file to match your local PostgreSQL credentials.

### Run this example in this repo

```bash
npm install
npm start
```

## Test Routes

- Register: `curl -X POST -d "username=alice&password=secret" http://localhost:3000/users/register`
- Log in: `curl -X POST -d "username=alice&password=secret" http://localhost:3000/users/login`
- Health check: `curl http://localhost:3000/health`

Open `http://localhost:3000` to use the included HTML forms.
