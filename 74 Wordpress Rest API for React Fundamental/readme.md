# WordPress REST API for React App Development

To access WordPress as an API to provide JSON, you use the **WordPress REST API**. It's built-in to WordPress since version 4.7 (released in 2016), and allows you to get data like posts, pages, users, categories, etc., in **JSON format**.



---

###  Basic Endpoint

```
https://yourdomain.com/wp-json/wp/v2/
```

This base URL gives you access to different types of data:

| Resource   | Endpoint                                         |
| ---------- | ------------------------------------------------ |
| Posts      | `/wp-json/wp/v2/posts`                           |
| Pages      | `/wp-json/wp/v2/pages`                           |
| Categories | `/wp-json/wp/v2/categories`                      |
| Tags       | `/wp-json/wp/v2/tags`                            |
| Users      | `/wp-json/wp/v2/users` (requires authentication) |

---

###  Example

To get the latest posts:

```http
GET https://yourdomain.com/wp-json/wp/v2/posts
```

Response:

```json
[
  {
    "id": 42,
    "date": "2025-06-23T12:00:00",
    "title": {
      "rendered": "Your Post Title"
    },
    "content": {
      "rendered": "<p>Your post content...</p>"
    },
    ...
  },
  ...
]
```

---

###  Authentication (For Protected or Custom Data)

If you want to create, update, or delete content—or access private data—you need **authentication**:

#### 1. **Basic Authentication** (for testing only)

* Install the plugin: [Basic Auth Plugin (GitHub)](https://github.com/WP-API/Basic-Auth)
* Use headers:

  ```http
  Authorization: Basic base64(username:password)
  ```

#### 2. **JWT Authentication**

* Install JWT Auth plugin
* Authenticate to get a token
* Use the token in headers:

  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

---

###  Custom REST Endpoints

You can also register your own custom endpoints in `functions.php`:

```php
add_action('rest_api_init', function () {
    register_rest_route('myplugin/v1', '/hello/', array(
        'methods' => 'GET',
        'callback' => 'my_custom_function',
    ));
});

function my_custom_function() {
    return new WP_REST_Response(['message' => 'Hello, API!'], 200);
}
```

Try it at:

```
https://yourdomain.com/wp-json/myplugin/v1/hello
```

---

