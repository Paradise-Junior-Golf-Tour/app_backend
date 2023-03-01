const jwt_decode = require("jwt-decode");

module.exports = {

  async findUserEvents(ctx) {
    const token = jwt_decode(ctx.request.header.authorization);
    await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          id: token.id,
        },
        populate: ["events"],
      })
      .then((res) => {
        console.log("[User API] find one res:", res);
        ctx.response.body = res.events;
        ctx.response.status = 200;
      })
      .catch((err) => {
        console.log("[User API] find one err:", err);
      });
  },

  async findByEvent(ctx) {
    const { id } = ctx.request.query;
    console.log(id);
    console.log("[User API] Find By Event ID:", id);

    // Override the default 404
    ctx.response.status = 500;
    ctx.response.message = "An unknown error ocurred.";

    if (!id) {
      ctx.response.status = 400;
    }

    await strapi.entityService
      .findMany("plugin::users-permissions.user", {
        filters: {
          events: {
            id: {
              $eq: parseInt(id),
            },
          },
        },
        fields: ["*"],
      })
      .then((users) => {
        ctx.response.status = 200;
        ctx.response.body = {
          data: users,
        };
      })
      .catch((error) => {
        console.log("[User API] Find By Event ID ERROR:", error);
        ctx.response.body = {
          error: error.stack.message,
        };
      });
  },
};
