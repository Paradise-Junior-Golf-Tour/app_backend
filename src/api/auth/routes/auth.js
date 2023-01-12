module.exports = {
    routes: [ 
      { // Path defined with a regular expression
        method: 'POST',
        path: '/auth/refresh-token', // Only match when the URL parameter is composed of lowercase letters
        handler: 'auth.refreshToken',
      },
    ]
  }