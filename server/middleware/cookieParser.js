const parseCookies = (req, res, next) => {
  var cookie = req.headers.cookie;
  var obj = {};
  if (cookie !== undefined) {
    var cookieSplit = cookie.split(';');
    for (var i = 0; i < cookieSplit.length; i++) {
      var eachCookieArr = cookieSplit[i].split('='); 
      obj[eachCookieArr[0].trim()] = eachCookieArr[1].trim(); 
    }
  }
  req.cookies = obj;
  next();
};

module.exports = parseCookies;