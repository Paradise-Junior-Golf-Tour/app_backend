module.exports = {
  routes: [
    { // Path defined with a regular expression
      method: 'GET',
      path: '/transactions/event-id', // Only match when the URL parameter is composed of lowercase letters
      handler: 'custom.findByEvent',
    },
  ]
}



