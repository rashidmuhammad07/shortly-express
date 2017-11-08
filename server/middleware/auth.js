const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  var simpleSessionCreator = function() {
    models.Sessions.create()
      .then(function(data) {
        return data.insertId;
      })
      .then(function(newSessionId) {
        return models.Sessions.get({ id: newSessionId });
      })
      .then(function(row) {
        req.session = { hash: row.hash };
        res.cookie('shortlyid', row.hash );
        next();
      })
      .catch(function(error) {
        console.log('Error occurrrrred!!!!!');
        // res.status(500).send(error);
      });
  };
  // If the req doesn't have a session object or we don't find a session in the db...
    // Create a new session...
    //console.log('what is req.cookies ', req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    simpleSessionCreator();

  } else {

    // If req already has a cookie with hash  
    if (req.cookies.shortlyid) {
      // Use the hash to find a session in the db.
      models.Sessions.get({ hash: req.cookies.shortlyid })
        .then(function(sessionsRow) {
          // If we found a session...
          if (sessionsRow !== undefined) {
            // If the session also has a userID
            if (sessionsRow.userId !== null) {
              // Get the username from the Users db
              models.Users.get({ id: sessionsRow.userId })
                // Update the session object with the userID and username
                .then(function(userRow) {
                  req.session = {
                    hash: sessionsRow.hash, 
                    userId: userRow.id,
                    user: {
                      username: userRow.username
                    }
                  };
                  res.cookie('shortlyid', sessionsRow.hash );
                  next();
                });
            } else {
            // If session doesn't have a userID
              // Assign a session obj to the request
              req.session = {
                hash: sessionsRow.hash 
              };
              res.cookie('shortlyid', sessionsRow.hash );
              next();
            }
          } else {
          // If we don't find a session in the db..
            // Clear the user's cookie
            // Create a new session
            simpleSessionCreator();
          }
        })
        .catch(function(error) {
          console.log('Error occurred!', error);
          // res.status(500).send(error);
        });
    }
    
  }




};


/*

req.session = {
  hash: '8a864482005bcc8b968f2b18f8f7ea490e577b20',
  userId: 34,
  user: {
    username: 'Bob'
  }
}

*/


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
