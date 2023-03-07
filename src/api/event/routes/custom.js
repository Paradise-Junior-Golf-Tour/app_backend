module.exports = {
  routes: [
    {
      // Path defined with a regular expression
      method: "GET",
      path: "/events/all", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.findAll",
    },
    {
      // Path defined with a regular expression
      method: "POST",
      path: "/events/new", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.createNew",
    },
    {
      // Path defined with a regular expression
      // MAY NOT BE IN USE
      method: "GET",
      path: "/events/one", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.findUserEvents",
    },
    {
      // Path defined with a regular expression
      method: "GET",
      path: "/events/details", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.findEventDetails",
    },
    {
      // Path defined with a regular expression
      method: "GET",
      path: "/events/gallery", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.findEventGallery",
    },
    {
      // Path defined with a regular expression
      method: "POST",
      path: "/events/register", // Only match when the URL parameter is composed of lowercase letters
      handler: "custom.register",
      // config: {
      //   policies: ['plugin::users-permissions.isAuthenticated']
      // }
    },
  ],
};
