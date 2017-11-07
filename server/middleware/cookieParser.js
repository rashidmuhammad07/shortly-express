const parseCookies = (req, res, next) => {
  var cookie = req.headers.cookie;
  if (cookie !== undefined) {
    var cookieSplit = cookie.split(';');
    for (var i = 0; i < cookieSplit; i++) {
      if (cookieSplit[i] === '=') {
        cookieSplit[i] = ':';
      }
    } 
  }
};

module.exports = parseCookies;