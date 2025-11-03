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

Connect to the psql prompt as superuser: 

```bash
sudo -u postgres psql
```

Create the DB and User (unless already done):

```sql
CREATE ROLE student LOGIN PASSWORD 'student';
CREATE DATABASE registration_login OWNER student;
GRANT ALL PRIVILEGES ON DATABASE registration_login TO student;

```

Logout and log back in as the new user, connect to the DB, and then create the users table.

```sh
psql -U student -d registration_login -h localhost
```

```sql
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

## Browser Demo

1. Start the server with `npm start` and open `http://localhost:3000` in your browser.
2. The page at `public/index.html` contains forms for registering and logging in via `fetch` calls to the API.
3. A successful login stores the signed token in `localStorage` under the key `jwtToken`; the page displays the saved value and exposes buttons to fetch the protected profile or clear the stored token.
4. To inspect the token manually, open your browser developer tools, navigate to the **Application** (or **Storage**) tab, and review `Local Storage` → `http://localhost:3000` → `jwtToken`. You can also run `localStorage.getItem('jwtToken')` from the console.
5. When the token is present, use the **Fetch Profile** button to call `/auth/profile` and verify that the Authorization header is working end-to-end.
