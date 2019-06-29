# Blissful Plant

Description
-----------
 Having an indoor garden with beautiful lush plants can seem difficult. But the key to plants success is water. 
 Blissful Plant was created to take the guess work out of remembering when your plants need water. 

Live Demo
----------
* [Live Demo](https://my-blissful-plant-app.now.sh/)

### Link to Front-end
------------------
* [Front-end GitHub](https://github.com/ekeaton/Blissful-plant-app)

### Installing
Install the dependencies and devDependencies and start the server.
```
npm install  
npm start
```
### Testing
To run back-end tests run `npm test` in terminal.

### Schema
#### User
``` 
(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    email CHAR(255) NOT NULL,
    password CHAR(10) NOT NULL
);
```
   

#### Plants
```
(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  note TEXT,
  num_days INTEGER NOT NULL,
  water_date DATE NOT NULL DEFAULT now(),
);
```

#### API Overview
```
/api
.
|__ /plants
|   |__ GET
|   |    |__ /
|   |    |__ /:plant_id
|   |__ POST
|   |   |__ /
|   |__ DELETE
|   |   |__ /:plant_id   
|__ /users
|    |__ POST
|    |    |__ /
|    |__ GET
|    |    |__ /
|    |    |__ /user
|    |__PATCH
|    |  |__ /user
|    |__ DELETE
|        |__ /user
```

#### GET /api/plants
```
// res.body
[
  {
    id: Number,
    name: String,
    note: String,
    num_days: Number,
    water_date: Date  
  }  
]
``` 

#### GET /api/plants/:plant_id
```

// req.params
  plant_id: Number

// res.body
[
  {
   id: Number,
    name: String,
    note: String,
    num_days: Number,
    water_date: Date  
  }  
]
```

#### POST /api/plants
```
// req.body
{
   name: String,
   note: String,
   num_days: Number,
   water_date: Date 
}
```

#### DELETE /api/plants/:plant_id
```
// req.params
  plant_id: Number
```

#### GET /api/users
```
// res.body
[
  {
    name: String,
    email: String,
    password: String
  }
]
```

#### GET /api/users/user
```
// req.user
id: Number

// res.body
[
  {
    name: String,
    email: String,
    password: String
  }
]
```

#### POST /api/users
```
// req.body
{
  name: String,
  email: String,
  password: String
}

// res.body
[
  {
    id: Number,
    name: String,
    email: String,
    password: String
  }
]
```

#### DELETE /api/users/user
```
// req.user
id: Number
```

#### PATCH /api/posts/user
```
// req.body
{
  name: String,
  email: String,
  password: String
}
```
