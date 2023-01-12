module.exports = {
    routes: [ 
      { // Path defined with a regular expression
        method: 'GET',
        path: '/tee-times/custom', // Only match when the URL parameter is composed of lowercase letters
        handler: 'custom.index',
      },
      { // Path defined with a regular expression
        method: 'PATCH',
        path: '/tee-times/all', // Only match when the URL parameter is composed of lowercase letters
        handler: 'custom.all',
      }
    ]
  }