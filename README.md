# Messenger app

---

School project aiming to create the back-end part of a messenger application. 

## Stack

---

- Node.js version 12.18.4
- Express version 4.17.1



## Functionalities

### Authentication

---

- Login
> POST /api/auth/login

- Logout
> DELETE /api/auth/logout

### Users

---

- Add a user
> POST /api/users

- Find all users
> GET /api/users

- Find user by id
> GET /api/users/:id

- Find currently connected user
> GET /api/users/me


### Discussion

---

- Add a discussion
> POST /api/discussions

- Display all discussions the user is a member of
> GET /api/discussions

The number of discussions displayed on a same page can be changed with maxDiscussionsDisplayed in config.js. The remaining discussions will be taken care of by a pagination system

- Delete discussion
> DELETE /api/discussions

The messages belonging to the discussion WON'T be deleted.

- Add members to a discussion
> PUT /api/discussions/add/:id/:user_id



### Messages

---

- Add message to a discussion
> POST /api/messages

The discussion id is required for this to work

- Edit or delete a message
> PUT /api/message/edit/:id

Edition or deletion is managed with the option "action" set in the body of the request. 
Deleting a message will just replace the content of the message with "Message deleted".
The history of the content before edition or deletion is kept in "content_history" path in MessageModel.

- Display messages of a discussion
> GET /api/messages/:id

:id parameter is the id of the discussion
The number of discussions displayed on a same page can be changed with maxMessagesDisplayed in config.js. The remaining messages will be taken care of by a pagination system

### Security

---

- A JsonWebToken is generated when a user logins and stored in a cookie for authentication purpose. The cookie is deleted when user log out or after 900 000 seconds (app. 10days) have passed.

### Other

---

- Localization (fr/en) is included and can be found in /locales in their respective files. Language can be changed in config.js with "fr" or "en".
- A .env file must be created if one should change the port number from the default 3000. The .env.sample file is there as a model for this file.
- A documentation is available at out/index.html
- A postman export is available for testing. See messenger.postman_collection.json