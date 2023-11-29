# Cinder

Repository for CSCI 187 Project. In order to run on your system, you'll need to install Node.js on your system. Instructions for how to do this are given [here](https://nodejs.org/en/download/package-manager).

Once the repository is cloned on your computer, you can use 'npm install --force --save' inside the cinder directory to install the necessary packages. Afterwards, you can simply run `npm run web` to test the app in your browser.

## Running the application in a development environment

1. `npm install --force --save`
2. `npx tsc`
3. `node server/server.js`
4. `npm start`

# API Endpoint Documentation

## `GET /account/{id}`

### Description

This endpoint retrieves information about a specific user.

### Parameters

- `id` (required): The unique identifier of the user.

### Request

```http
GET /account/123
```

###Response

```json
{
    "id":"n2to7j44j7v6zyx",
    "username":"ThomasIsABigLoser",
    "profile_pic":"https://imgur.com/image_link",
    "phone_number":"2032127226",
    "class_year":2024,
    "bio":"cool bio",
    "owned_listings":[
        {
            "id":6,
            "listing_name":"Album",
            "owner_id":"n2to7j44j7v6zyx",
            "description":"Bang",
            "size":"L",
            "waist":null,
            "inseam":"top",
            "category":"1701147400",
            "created_at":null,
            "tags":["cool","tags2","tags3","tags4"],
            "image_links":["https://i.imgur.com/bctsoAx.jpeg"]
        }
    ]
}
```

### Status Codes
200 OK: Successful request
400 Bad Request: User does not exist
500 Internal server error

## `GET /account`

### Description

This endpoint retrieves information about the authenticated user.

### Request

```http
GET /account
```

###Response

```json
{
    "id":"n2to7j44j7v6zyx",
    "username":"ThomasIsABigLoser",
    "profile_pic":"https://imgur.com/image_link",
    "phone_number":"2032127226",
    "class_year":2024,
    "bio":"cool bio",
    "owned_listings":[
        {
            "id":6,
            "listing_name":"Album",
            "owner_id":"n2to7j44j7v6zyx",
            "description":"Bang",
            "size":"L",
            "waist":null,
            "inseam":"top",
            "category":"1701147400",
            "created_at":null,
            "tags":["cool","tags2","tags3","tags4"],
            "image_links":["https://i.imgur.com/bctsoAx.jpeg"]
        }
    ]
}
```

### Status Codes
200 OK: Successful request
401 Unauthorized: You are not signed in
500 Internal server error

## `GET /match`

### Description

This endpoint retrieves information about the authenticated user's matches

### Request

```http
GET /match
```

###Response

```json
{
  "72l8ux9nredq88u": {
    "listings_you_have_liked": [
      {
        "id": 7,
        "listing_name": "Inner Speaker",
        "owner_id": "72l8ux9nredq88u",
        "description": "Bang",
        "size": "M",
        "waist": null,
        "inseam": "accessory",
        "category": "1701148012",
        "created_at": null,
        "tags": [
          "bang",
          "tags2",
          "tags3",
          "tags4"
        ],
        "image_links": [
          "https://i.imgur.com/fzCsSOY.jpeg"
        ]
      }
    ],
    "listings_they_have_liked": [
      {
        "id": 6,
        "listing_name": "Album",
        "owner_id": "n2to7j44j7v6zyx",
        "description": "Bang",
        "size": "L",
        "waist": null,
        "inseam": "top",
        "category": "1701147400",
        "created_at": null,
        "tags": [
          "cool",
          "tags2",
          "tags3",
          "tags4"
        ],
        "image_links": [
          "https://i.imgur.com/bctsoAx.jpeg"
        ]
      }
    ],
    "their_account_info": {
      "id": "72l8ux9nredq88u",
      "username": "LukeIsABigLoser",
      "profile_pic": "https://i.imgur.com/Y6t3Gtk.jpeg",
      "phone_number": "2032127226",
      "class_year": 2023,
      "bio": "Bang",
      "owned_listings": [
        {
          "id": 7,
          "listing_name": "Inner Speaker",
          "owner_id": "72l8ux9nredq88u",
          "description": "Bang",
          "size": "M",
          "waist": null,
          "inseam": "accessory",
          "category": "1701148012",
          "created_at": null,
          "tags": [
            "bang",
            "tags2",
            "tags3",
            "tags4"
          ],
          "image_links": [
            "https://i.imgur.com/fzCsSOY.jpeg"
          ]
        }
      ]
    }
  }
}
```

### Status Codes
200 OK: Successful request
401 Unauthorized: You are not signed in
500 Internal server error

<details>
 <summary><code>POST</code> <code><b>/filtered-listings</b></code> <code>(Returns all listing data matching your provided search criteria)</code></summary>

##### Instructions

If you wish to get all listings, just pass an empty array for all parameters. Note once you provide at least one value
that is not an empty array for a search you will need to be explicit in what you are searching for. Example: if you want
any listing with a size medium you will need to pass a request with a body like:
`json
{ "sizes": ["M"], "categories": ["top", "bottom", "accessory", "shoes"], "tags": [], "inseam_lengths": [], "waist_sizes": [] }
`
If you were to instead do:
`json
{ "sizes": ["M"], "categories": [], "tags": [], "inseam_lengths": [], "waist_sizes": [] }
`
The endpoint would return nothing since you selected 0 categories.

##### Parameters

> | name             | type     | data type | description                                               |
> | ---------------- | -------- | --------- | --------------------------------------------------------- |
> | `sizes`          | required | string[]  | The sizes you want the returned listings to have          |
> | `waist_sizes`    | required | number[]  | The waist sizes you want the returned listsing to have    |
> | `inseam_lengths` | required | number[]  | The inseam lengths you want the returned listings to have |
> | `categories`     | required | string[]  | The categories of listings you want to have returned      |
> | `tags`           | required | string[]  | The tags you want the listings returned to have           |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                 |
> | --------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `200`     | `application/json` | `[{ "id": 1, "listing_name": "Rust", "owner_id": "o3lh4vrvdw85o6b", "description": "bang", "size": "M", "waist": null, "inseam": null, "category": "top", "created_at": "2023-11-21T03:17:52.000Z", "tags": ["tags1", "tags2", "tags3", "tags4"], "image_links": ["https://i.imgur.com/hCjlYSf.jpeg"] }] |
> | `400`     | `application/json` | `{ "error": "Please provide valid values for all fields: tags, waist_sizes, inseam_lengths, sizes, and categories. If you wish to not specify one or more of these fields for your search, just assign an empty array to that field's value'" }`                                                         |
> | `500`     | `application/json` | `{"error": "An unknown error occurred"}`                                                                                                                                                                                                                                                                 |

</details>

<details>
 <summary><code>POST</code> <code><b>/listing</b></code> <code>(Creates a listing of an item of clothing somone wishes to sell or swap on Cinder)</code></summary>

##### Parameters

> | name           | type     | data type          | description                                                        |
> | -------------- | -------- | ------------------ | ------------------------------------------------------------------ |
> | `file`         | required | Buffer or Buffer[] | The binary of an image, can be more than one                       |
> | `listing_name` | required | string             | The name of the listing                                            |
> | `size`         | optional | string             | The size of the cloting item                                       |
> | `waist`        | optional | number             | The length of the waist (only for bottoms)                         |
> | `insteam`      | optional | number             | The length of the inseam (only for bottoms)                        |
> | `description`  | required | string             | The description for the listing                                    |
> | `category`     | required | string             | The category the listing is for (top, bottom, accessory, or shoes) |
> | `tags`         | required | string[] or string | The user generated tags for the listing                            |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"message": "OK"}`                              |
> | `400`     | `application/json` | `{"error":"No image provided for listing"}`      |
> | `500`     | `application/json` | `{"error":"status 500, failed to upload image"}` |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: multipart/form-data" -d '-----WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="file"; filename="pants_back.png"\
> Content-Type: image/png\
> \
> \
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="file"; filename="pants_front.png"\
> Content-Type: image/png\
> \
> \
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="listing_name"\
> \
> Cool pants\
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="description"\
> \
> Lightly used cool pants (worn once)\
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="price"\
> \
> 23\
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe\
> Content-Disposition: form-data; name="category"\
> \
> accessory\
> ------WebKitFormBoundaryaWlA9egrpy2SXNMe--' http://localhost:3000/listing
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>/listing/:listing_id</b></code> <code>(Gets the data for a particular listing id)</code></summary>

##### Parameters

> | name         | type     | data type | description                              |
> | ------------ | -------- | --------- | ---------------------------------------- |
> | `listing_id` | required | number    | The id for the listing you want data for |

##### Responses

> | http code | content-type       | response                             |
> | --------- | ------------------ | ------------------------------------ |
> | `200`     | `application/json` | `{"message": "OK"}`                  |
> | `400`     | `application/json` | `{"No listing with that id exists"}` |
> | `500`     | `application/json` | `Server Error`                       |

</details>
<details>
 <summary><code>DELETE</code> <code><b>/listing/:listing_id</b></code> <code>(Deletes a specified listing from the database)</code></summary>

##### Parameters

> | name         | type     | data type | description                               |
> | ------------ | -------- | --------- | ----------------------------------------- |
> | `listing_id` | required | number    | The id for the listing you want to delete |

##### Responses

> | http code | content-type       | response                  |
> | --------- | ------------------ | ------------------------- |
> | `200`     | `application/json` | `{"message": "OK"}`       |
> | `500`     | `application/json` | `{"error": "some error"}` |

</details>

<details>
 <summary><code>PUT</code> <code><b>/listing/:listing_id</b></code> <code>(Updates a listing for an item of clothing to be published on Cinder)</code></summary>

##### Parameters

> | name               | type     | data type          | description                                                                  |
> | ------------------ | -------- | ------------------ | ---------------------------------------------------------------------------- |
> | `file`             | required | Buffer or Buffer[] | The binary of an image, can be more than one                                 |
> | `listing_name`     | required | string             | The name of the listing                                                      |
> | `price`            | optional | number             | The price of the listing                                                     |
> | `description`      | required | string             | The description for the listing                                              |
> | `category`         | required | string             | The category the listing is for (top, bottom, accessory, or shoes)           |
> | `tags`             | required | string[] or string | The user generated tags for the listing                                      |
> | `tags_to_remove`   | required | string             | The user provided tag(s) previously on the listing you are wanting to remove |
> | `images_to_remove` | required | string[] or string | The image url(s) previously for the listing you are wanting to remove        |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"message": "OK"}`                              |
> | `400`     | `application/json` | `{"error":"No image provided for listing"}`      |
> | `500`     | `application/json` | `{"error":"status 500, failed to upload image"}` |

</details>

<details>
 <summary><code>POST</code> <code><b>/signup</b></code> <code>(Creates an account with a username and password)</code></summary>

##### Parameters

> | name       | type     | data type | description              |
> | ---------- | -------- | --------- | ------------------------ |
> | `username` | required | string    | The username of the user |
> | `password` | required | string    | The user's password      |

##### Responses

> | http code | content-type       | response                           |
> | --------- | ------------------ | ---------------------------------- |
> | `200`     | `application/json` | `{"OK"}`                           |
> | `400`     | `application/json` | `{"Invalid username or password"}` |
> | `500`     | `application/json` | `{"An unknown error occurred"}`    |

</details>

<details>
 <summary><code>POST</code> <code><b>/login</b></code> <code>(Signs in a user using their username and password)</code></summary>

##### Parameters

> | name       | type     | data type | description              |
> | ---------- | -------- | --------- | ------------------------ |
> | `username` | required | string    | The username of the user |
> | `password` | required | string    | The user's password      |

##### Responses

> | http code | content-type       | response                             |
> | --------- | ------------------ | ------------------------------------ |
> | `200`     | `application/json` | `{"OK"}`                             |
> | `400`     | `application/json` | `{"Incorrect username or password"}` |
> | `500`     | `application/json` | `{"An unknown error occurred"}`      |

</details>

# Component Documentation

<details>
 <summary><code>DetailsPost</code> <code>(Lets the user input details when they create a listing)</code></summary>

##### Props

</details>

<details>
 <summary><code>PreviewImage</code> <code>(Lets the user preview the image they are including in their listing)</code></summary>

##### Props

> | name       | description         |
> | ---------- | ------------------- |
> | `imageSrc` | Source of the image |

</details>
````
