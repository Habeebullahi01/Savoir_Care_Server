# E-store REST API

This project is the Backend API server for the Savoir Care project.

## Endpoints

The base URL [https://e-store-server.cyclic.app] to which all routes are appended.

### /auth/login (POST)

#### Sample Request

```json
{
  "email": "emailaddress@provider.com",
  "password": "12345789"
}
```

#### Successful Response

```json
{
  "auth": true,
  "msg": "Success",
  "token": "Bearer _the jwt token_"
}
```

It also sends a cookie named _auth_ that contains the token and a _max_age_ property of 1 day.

Returns a response of status 400(Bad Request) when the required fields are absent, with a body that contains the _message_ property that states the details of the error.

#### Failed Response

```json
{
    "absent_field": ["email","password"],
    "message": "Request body should not be empty."
}
||
{
    "absent_field": "password",
    "message": "Password field should not be empty."
}
||
{
    "absent_field": "email",
    "message": "Email field should not be empty."
}
```

Returns a response of status 401(Not Found) when either of the required fields is incorrect, with a body that contains the _message_ property that states the details of the error.

#### Failed Response

```json
{
  "message": "Invalid Password",
  "auth": false,
  "invalidCred": "password"
}
```

### /auth/signup (POST)

#### Sample Request

```json
{
  "f_name": "Adam",
  "l_name": "Muhammad",
  "email": "emailaddress@provider.com",
  "password": "12345789"
}
```

The Response is similar to the _/login_ route above.
It also sends a cookie named _auth_ that contains the token and a _max_age_ property of 1 day.
When the email of an existing user is used:

```json
{
  "msg": "User already exists",
  "auth": false,
  "invalidCred": "email"
}
```

### /auth/admin/login (POST) **admin**

Similar to the _/login_ route above. It also sends a cookie named _admin_auth_ that contains the token and a _max_age_ property of 1 day.

### /auth/admin/signup (POST) **admin**

Similar to the _/signup_ route above. It also sends a cookie named _admin_auth_ that contains the token and a _max_age_ property of 1 day.

### /products (GET)

This returns an object containing details about the current cursor on the inventory. A sample response object is shown below.

```json
{
    "totalItemCount": 12,
    "totalPageCount": 1,
    "itemsPerPage": 15,
    "products": [
        {
            "_id": "lsnknvksssjvlskns24tn42lknkj42",
            "name": "Product Name",
            "imageURL": "https://pathtoimage.jpg",
            "price": 500
        }, ...
    ]
}
```

### /products/[id] (GET)

This returns an object containing the details of a product whose \__id_ in the database is equal to the dynamic route parameter _id_. A sample is given below.

```json
{
  "_id": "lsnknvksssjvlskns24tn42lknkj42",
  "name": "Product Name",
  "imageURL": "https://pathtoimage.jpg",
  "description": "Description of the product.",
  "quantity": 2,
  "price": 500
}
```

### /products/addProduct (POST) **admin**

#### Sample Request

```json
{
  "name": "Product Name",
  "imageURL": "https://path_to_image.com/jpg",
  "description": "A description of the product",
  "quantity": 4,
  "price": 899,
  "tags": ["hair", "skin"]
}
```

#### Sample Response

```json
{
  "_id": "lscnklsncs98598tjvnsh0",
  "name": "Product Name",
  "imageURL": "https://path_to_image.com/jpg",
  "description": "A description of the product",
  "quantity": 4,
  "price": 899,
  "tags": ["hair", "skin"]
}
```

### /products/updateProduct/[id] (POST) **admin**

#### Sample Request

```json
{
  "name": "New Product Name",
  "imageURL": "https://path_to_image.com/jpg",
  "description": "A description of the product",
  "quantity": 4,
  "price": 899,
  "tags": ["hair", "skin"]
}
```

#### Sample Response

```json
{
  "acknowledged": true, // false
  "productID": "ksjklcnslv0384hbfkj3nf03"
}
```

### /products/deleteProduct/[id] (DELETE) **admin**

This deletes the product with the _id_ specified in the URL.

#### Sample Response

```json
{
  "message": "Product has been deleted."
}
```

### /cart (GET)

This returns the cart document of the logged in client.

#### Sample Response

```json
{
  "_id": "alkfw029j403inf",
    "user_id": "sllksndcw8y2hd",
    "products": [
            {
        "product_id": "jhdckhoy3289huuh298h",
        "quantity": 3,
        "variation": "x"
        }...]
    }
```

### /cart/add (POST)

This adds an item to the logged in client's cart document.

#### Sample request

```json
{
  "product_id": "lsnlsn9u2093n2o",
  "quantity": 3,
  "variation": "red"
}
```

#### Sample Response

```json
{
  "success": true
}
```

### /cart/update (POST)

This changes the _variation_ and/or _quantity_ of an item in the logged in user's cart document.

#### Sample Request

```json
{
  "product_id": "lsnlsn9u2093n2o",
  "quantity": { "old": 2, "new": 5 },
  "variation": { "old": "red", "new": "teal" }
}
```

#### Sample Response

```json
{
  "success": "true" // false
}
```

### /cart/delete (DELETE)

This removes an item from the logged in user's cart document.

#### Sample Request

```json
{
  "product_id": "lsnlsn9u2093n2o",
  "variation": "blue"
}
```

#### Sample Response

```json
{
  "success": "true", // false
  "messsage": "Removed ____ items from cart."
}
```

### /order (GET)

Goal: _Retrieve all orders made by client._

This returns an array of orders that have been made by the logged in user.

#### Sample Response

```json
[
    {
        "_id": "1a882a4qeqfeqf137faef45t98",
        "user_id": "54g546h5edb3g7j76k7890lu",
        "paymentStatus": "Pending",
        "location": "The location",
        "delivery_date": null,
        "order_status": "Processing",
        "products": [
            {
                "quantity": 4,
                "variation": "3",
                "_id": "63ffef937101944dee76e7a1"
            },
            {
                "quantity": 5,
                "variation": "blue",
                "_id": "6409214f1c8917896d33939d"
            },
            {
                "quantity": 9,
                "variation": "red",
                "_id": "6409219f1c8917896d3393b5"
            }
        ],
        "order_date": "2023-03-15T11:14:10.937Z",
        "__v": 0
    },...
]
```

### /order (POST)

Goal: _Create a new order._

This needs creates a new order on behalf of the logged in user. The products in the user's cart are the object of the order, and the cart will be emptied once the order has been made. The _location_ request parameter must be sent with this request. Optional request parameter _extra_info_ can be sent to include miscelleanous details about the order.

#### Sample Request

```json
{
  "location": "1, Infinite Loop, Silicon valley, SF.",
  "extra_info": "Please deliver the products in a white carton."
}
```

#### Sample Response

```json
{
  "message": "Order Created"
}
```

It may respond with an error and its details.

```json
{
  "message": "Cart is empty. No products found."
}
```

```json
{
  "message": "Location cannot be empty."
}
```
