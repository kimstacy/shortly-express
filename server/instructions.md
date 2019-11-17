📌 Current Tasks:

1. Cookie parser
2. Session store / parser
3. Signup routes
4. If we get to the Login route, we need to add authentication to all the routes that need to be locked down

_____________
🚩 Instructions

Implement an authentication system and user-specific features for Shortly, a URL-shortening service similar to bit.ly

Your service:
- Gives users the ability to sign in and out
- Users will also be able to store their own collections of shortened URLs with a counter for the total number of visits.

Objective:
- Securely manage sensitive user information
- Decide what portions of the Shortly app should be restricted to authenticated users and which should be available to the public

Build a simple session-based server-side authentication system - from scratch.
Use the tests in test/ServerSpec.js + the following outline to guide you in your implementation.
_____________

📍 Minimum Requirements 📍

💠 Usernames and Passwords
 - The database table, 🔺users, and its corresponding model are provided. Use this to store usernames and passwords.
 - The model includes useful methods for encrypting and comparing your passwords.

🔲 Add routes to your Express server to process incoming POST requests.
 - These routes should enable a user to register for a new account and for users to log in to your application.
 - Determine which routes you need to add by looking at these templates:
  🔺 VIEWS / login.ejs           🔺 VIEWS / signup.ejs

🔲 Add the appropriate callback functions to your new routes.
 - Add methods to your user model, as necessary, to keep your code modular.
   (i.e., your database model methods should not receive as arguments or otherwise have access to the request or response objects)


💠 Sessions and Cookies

  Write 2 custom middleware functions to configure your Express server.
  1. A cookie parser
  2. A session generator

- Though Express has its own middleware packages named 🔺cookie-parser + 🔺express-session, you'll be building this functionality from scratch.
 (Read as: you should not be using the cookie-parser and express-session middleware packages anywhere in your code).

- The database table, 🔺sessions , has been provided as a place to store your generated session hashes.

🔲 In 🔺middleware/cookieParser.js, write a middleware function that will:
  - access the cookies on an incoming request
  - parse them into an object
  - assign this object to a 🔺cookies property on the request

🔲 In 🔺middleware/auth.js, write a 🔸createSession middleware function that:
  - accesses the parsed cookies on the request
  - looks up the user data related to that session
  - assigns an object to a 🔺session property on the request that contains relevant user information.
    (Ask yourself: what information about the user would you want to keep in this session object?)

Reminders:
- An incoming request without cookies should generate a session with a unique hash and store it the 🔺sessions database.
  The middleware function should use this unique hash to set a cookie in the response headers. (Ask yourself: How do I set cookies using Express?)

- If an incoming request has a cookie, the middleware should verify that the cookie is valid (i.e., it is a session that is stored in your database)

- If an incoming cookie is not valid, what do you think you should do with that session and cookie?

🔲 Mount these 2 middleware functions in 🔺app.js so that they are executed for all requests received by your server.


💠 Authenticated Routes

🔲 Add a 🔸verifySession helper function to all server routes that require login, redirect the user to a login page as needed.
  - Require users to log in to see shortened links and create new ones.
  - Do NOT require the user to login when using a previously shortened link.

🔲 Give the user a way to log out.
  - What will this need to do to the server session and the cookie saved to the client's browser?


💠 Tests

🔲 Write at least 3 new meaningful tests inside of 🔺test/ServerSpec.js

