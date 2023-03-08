module.exports = {
  routes: [
    {
      method: "GET",
      path: "/events/all",
      handler: "custom.eventAll",
    },
    {
      method: "POST",
      path: "/events/new",
      handler: "custom.eventNew",
    },
    {
      method: "PATCH",
      path: "/events/new",
      handler: "custom.eventNew",
    },
    {
      // TODO: Check and see if this is even in use anymore and clean up if not.
      method: "GET",
      path: "/events/one",
      handler: "custom.eventsAllByUser",
    },
    {
      method: "GET",
      path: "/events/details",
      handler: "custom.eventSingleDetails",
    },
    {
      method: "GET",
      path: "/events/gallery",
      handler: "custom.eventImageGallery",
    },
    {
      method: "POST",
      path: "/events/register",
      handler: "custom.eventRegister",
    },
  ],
};
