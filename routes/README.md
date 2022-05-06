# REST API Documentation

# Register

### Request

## `POST /user`

Body

```json
{
	"firstName": "Your first name",
	"lastName": "Your last name",
	"password": "Password",
	"confirmPassword": "Password",
	"email": "example@gmail.com"
}
```

### Response

```json
{
	"message": "User has been created successfuly."
}
```

# Login

### Request

## `POST /user/login`

Body

```json
{
	"email": "example@gmail.com",
	"password": "Password"
}
```

### Response

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzQ3ZDYwMTU0ZTMyZmM1NmJjYTcxYSIsImZpcnN0TmFtZSI6IlNhbXVlbCIsImxhc3ROYW1lIjoiT2x1ZmVtaSIsImVtYWlsIjoia2lra3lib3lzdmVuQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDZUMDE6NDQ6MDAuMTE2WiIsImJyb2FkY2FzdHMiOltdLCJpYXQiOjE2NTE4MDI0NzEsImV4cCI6MTY1MTgyMDQ3MX0.e1m5fYf_gCvQzvCK8Ur23XNZL_d5c6hkeMeJyV5MYx8",
	"id": "62747d60154e32fc56bca71a"
}
```

# Admin Login

### Request

## `POST /admin/login`

Body

```json
{
	"email": "example@gmail.com",
	"password": "Password"
}
```

### Response

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzQ3ZDYwMTU0ZTMyZmM1NmJjYTcxYSIsImZpcnN0TmFtZSI6IlNhbXVlbCIsImxhc3ROYW1lIjoiT2x1ZmVtaSIsImVtYWlsIjoia2lra3lib3lzdmVuQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDZUMDE6NDQ6MDAuMTE2WiIsImJyb2FkY2FzdHMiOltdLCJpYXQiOjE2NTE4MDI0NzEsImV4cCI6MTY1MTgyMDQ3MX0.e1m5fYf_gCvQzvCK8Ur23XNZL_d5c6hkeMeJyV5MYx8"
}
```

# Logout

### Request

## `POST /user/logout`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"message": "User logged out successfully",
	"id": "62747d60154e32fc56bca71a"
}
```

# Get Users (Admin Route)

### Request

## `GET /user`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"users": [
		{
			"broadcasts": [],
			"_id": "62749020e6bb5f011dfe6cbc",
			"firstName": "Samuel",
			"lastName": "Olufemi",
			"email": "dfghj@gmail.com",
			"createdAt": "2022-05-06T03:04:00.620Z",
			"lastLogin": null,
			"lastLogout": null,
			"__v": 0
		},
		{
			"broadcasts": ["62749020e6bb5f011dfe6cbc"],
			"_id": "62747d60154e32fc56bca71a",
			"firstName": "Samuel",
			"lastName": "Olufemi",
			"email": "kikkyboysven@gmail.com",
			"createdAt": "2022-05-06T01:44:00.116Z",
			"lastLogin": "2022-05-06T02:01:11.807Z",
			"lastLogout": null,
			"__v": 0
		}
	]
}
```

# Add Broadcast to User

### Request

## `PUT /user/broadcast/:broadcastId`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzQ3ZDYwMTU0ZTMyZmM1NmJjYTcxYSIsImZpcnN0TmFtZSI6IlNhbXVlbCIsImxhc3ROYW1lIjoiT2x1ZmVtaSIsImVtYWlsIjoia2lra3lib3lzdmVuQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDZUMDE6NDQ6MDAuMTE2WiIsImJyb2FkY2FzdHMiOltdLCJpYXQiOjE2NTE4MDI0NzEsImV4cCI6MTY1MTgyMDQ3MX0.e1m5fYf_gCvQzvCK8Ur23XNZL_d5c6hkeMeJyV5MYx8",
	"id": "62747d60154e32fc56bca71a"
}
```

# Delete Broadcast from User

### Request

## `DELETE /user/broadcast/:broadcastId`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzQ3ZDYwMTU0ZTMyZmM1NmJjYTcxYSIsImZpcnN0TmFtZSI6IlNhbXVlbCIsImxhc3ROYW1lIjoiT2x1ZmVtaSIsImVtYWlsIjoia2lra3lib3lzdmVuQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDZUMDE6NDQ6MDAuMTE2WiIsImJyb2FkY2FzdHMiOltdLCJpYXQiOjE2NTE4MDI0NzEsImV4cCI6MTY1MTgyMDQ3MX0.e1m5fYf_gCvQzvCK8Ur23XNZL_d5c6hkeMeJyV5MYx8",
	"id": "62747d60154e32fc56bca71a"
}
```

# Reset User Pasword (Admin Route)

### Request

## `PATCH /user/:userId`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

Body

```json
{
	"password": "A new password"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"message": "User password reset successfully."
}
```

# Delete User (Admin Route)

### Request

## `DELETE /user/:userId`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"message": "User deleted successfully."
}
```

# Get Broadcasts

### Request

## `GET /broadcast`

### Response

```json
{
	"broadcasts": [
		{
			"_id": "6274886f05af1a00f9c7f0a6",
			"name": "new",
			"__v": 0
		},
		{
			"_id": "627486b2a58dcafff3c7c6d5",
			"name": "testing",
			"__v": 0
		}
	]
}
```

# Create Broadcast (Admnin Route)

### Request

## `POST /broadcast`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"message": "Broadcast created successfully."
}
```

# Delete Broadcast (Admnin Route)

### Request

## `POST /broadcast/:broadcastId`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

### Response

```json
{
	"message": "Broadcast deleted successfully."
}
```

# Get Login Stats (Admin Route)

### Request

## `GET /admin/login-stats`

Headers

```json
{
	"Authorization": "Bearer {{token}}"
}
```

NOTE: Token above is gotten from login response.

Body

```json
{
	"email": "02-05-2022"
}
```

### Response

```json
{
	"loginStat": {
		"date": "02-05-2022",
		"numberOfLogins": 0
	}
}
```
