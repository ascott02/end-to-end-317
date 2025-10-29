# Example 3 — Handling POST Data

Express server that renders a simple form and reads submitted values.

## Quick Start

### From scratch

```bash
mkdir post_vars
cd post_vars
npm init -y
npm install express
```

### Run this example in this repo

```bash
npm install
npm start
```

## How to Test

1. With the server running, open `http://localhost:3000` in a browser, enter a name, and submit the form to verify form-encoded POST handling.
2. Use curl to simulate the form submission:

	```bash
	curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "name=Alice" http://localhost:3000
	```

3. Send a JSON body to confirm `express.json()` is working:

	```bash
	curl -X POST -H "Content-Type: application/json" -d '{"name":"Bob"}' http://localhost:3000
	```

Each request should receive a greeting when the `name` field is present, or a reminder to supply a name when it is missing.
