/* Cookies are ways for servers to store information on a client. All cookies for a given host are transmitted back to the server on every subsequent request.

Write a middleware function that will access the cookies on an incoming request, parse them into an object, and assign this object to a cookies property on the request. */

const parseCookies = (req, res, next) => {
  // use get function to retrieve cookies header from req obj
  // if cookie string exists
  var cookie = req.get('Cookie') || '';

  parsed = cookie.split('; ').reduce((cookies, cookie) => {
    if (cookie.length) {
      let index = cookie.indexOf('=');
      let key = cookie.slice(0, index);
      let token = cookie.slice(index + 1);
      cookies[key] = token;
    }
    return cookies;
  }, {});

  req.cookies = parsed;

  // return obj with key value pairs for cookies that were being set

  // put parsed cookie obj in req obj.cookies -- so all subseq. middleware that runs after this function has access to all the cookies supplied to our app
  next();
};

module.exports = parseCookies;