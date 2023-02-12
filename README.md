# E-store REST API

This project is the Backend API server for the Savoir Care project.

## Endpoints

The base URL https://e-store-server.cyclic.app to which all routes are appended.

### /auth/login (POST)

### /auth/signup (POST)

### /auth/admin/login (POST)

### /auth/admin/signup (POST)

### /products (GET)

This returns an object containing details about the current cursor on the inventory. A sample response object is shown below.

```javascript
{
    totalItemCount: 12,
    totalPageCount: 1,
    itemsPerPage: 15,
    products: [
        {
            _id: objectId("lsnknvksssjvlskns24tn42lknkj42")
            name: "Product Name",
            imageURL: "https://pathtoimage.jpg",
            price: 500
        }, ...
    ]
}
```

### /products/[id] (GET)

This returns an object containing the details of a specific product, as specified by it's \__id_ in the dynamic route parameter _id_. A sample is given below.

```js
{
    _id: objectId("lsnknvksssjvlskns24tn42lknkj42"),
    name: "Product Name",
    imageURL: "https://pathtoimage.jpg",
    description: "Description of the product.",
    quantity: 2,
    price: 500
    }
```

### /product/[id] (POST)

## Usage
