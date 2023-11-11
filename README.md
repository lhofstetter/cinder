# Cinder

Repository for CSCI 187 Project. In order to run on your system, you'll need to install Node.js on your system. Instructions for how to do this are given [here](https://nodejs.org/en/download/package-manager).

Once the repository is cloned on your computer, you can use 'npm install --force --save' inside the cinder directory to install the necessary packages. Afterwards, you can simply run `npm run web` to test the app in your browser.

## Running the application in a development environment

1. `npm install --force --save`
2. `npx tsc`
3. `node server/server.js`
4. `npm start`

# API Endpoint Documentation

<details>
 <summary><code>POST</code> <code><b>/listing</b></code> <code>(Creates a listing of an item of clothing somone wishes to sell or swap on Cinder)</code></summary>

##### Parameters

> | name           | type     | data type          | description                                                        |
> | -------------- | -------- | ------------------ | ------------------------------------------------------------------ |
> | `file`         | required | Buffer or Buffer[] | The binary of an image, can be more than one                       |
> | `listing_name` | required | string             | The name of the listing                                            |
> | `price`        | optional | number             | The price of the listing                                           |
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

> | name              | type     | data type          | description                                                                  |
> | --------------    | -------- | ------------------ | ------------------------------------------------------------------           |
> | `username`        | required | string             | The username of the user                                                     |
> | `password`        | required | string             | The user's password                                                          |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"OK"}`                                         |
> | `400`     | `application/json` | `{"Invalid username or password"}`               |
> | `500`     | `application/json` | `{"An unknown error occurred"}`                  |

</details>

<details>
 <summary><code>POST</code> <code><b>/login</b></code> <code>(Signs in a user using their username and password)</code></summary>

##### Parameters

> | name              | type     | data type          | description                                                                  |
> | --------------    | -------- | ------------------ | ------------------------------------------------------------------           |
> | `username`        | required | string             | The username of the user                                                     |
> | `password`        | required | string             | The user's password                                                          |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"OK"}`                                         |
> | `400`     | `application/json` | `{"Incorrect username or password"}`             |
> | `500`     | `application/json` | `{"An unknown error occurred"}`                  |

</details>
