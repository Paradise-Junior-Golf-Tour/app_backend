module.exports = {
  routes: [
    // { // Path defined with a regular expression
    //   method: 'GET',
    //   path: '/users/role/1', // Only match when the URL parameter is composed of lowercase letters
    //   handler: 'custom.find',
    // },
    // TODO: Move this to the events service
    {
      method: "GET",
      path: "/users/event",
      handler: "custom.findByEvent",
    },
    {
      method: "GET",
      path: "/users/events",
      handler: "custom.eventsAllByUser",
    },
    {
      method: "GET",
      path: "/users/details",
      handler: "custom.userRelations",
    },
  ],
};
