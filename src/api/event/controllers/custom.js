const jwt_decode = require("jwt-decode");

module.exports = {
  // default res status is 404!!!!

  async eventAll(ctx) {
    ctx.response.status = 200; // we could also send a JSON
    const all = await strapi.entityService.findMany("api::event.event", {
      sort: { date: 'desc' },
      populate: ["transactions", "users", "tee-time"],
      fields: ["*"],
    });

    // Get users, teetimes, etc.

    ctx.response.body = {
      data: all,
    };
  },

  async eventsAllByUser(ctx) {
    const { identifier } = ctx.request.query;
    console.log("eventsAllByUser", { id: identifier, ctx });

    const event = await strapi.entityService.findOne(
      "api::event.event",
      parseInt(identifier),
      {
        populate: ["*"],
        fields: ["*"],
      }
    );

    console.log(`[Event API] eventsAllByUser`, event);

    ctx.response.body = event;
    ctx.response.status = 200;
  },

  async eventSingleDetails(ctx) {
    const { id } = ctx.request.query;
    console.log({ id: id, ctx });

    const event = await strapi.entityService.findOne(
      "api::event.event",
      parseInt(id),
      {
        populate: [
          "image",
          "users",
          "transactions",
          "tee_time_slots.users_permissions_users",
        ],
        fields: ["*"],
      }
    );

    console.log(`[Event API] eventsAllByUser`, event);

    ctx.response.body = event;
    ctx.response.status = 200;
  },

  async eventImageGallery(ctx) {
    const { id } = ctx.request.query;

    const eventGalllery = await strapi.entityService.findOne(
      "api::event.event",
      parseInt(id),
      {
        populate: ["gallery"],
        fields: "id",
      }
    );

    ctx.response.body = eventGalllery;
    ctx.response.status = 200;
  },

  // Create a new event.
  async eventNew(ctx) {
    const {
      name,
      description,
      fee,
      date,
      max_users,
      image,
      registration_start_date,
      registration_end_date,
      address_1,
      address_2,
      address_city,
      address_state,
      address_zip,
      start
    } = ctx.request.body.data;
    const apiEvent = "api::event.event";

    let event = {
      id: null,
      error: null,
    };

    const slug = name.toLowerCase().replaceAll(/[^a-z0-9]+/gi, "-");

    await strapi.entityService
      .create(apiEvent, {
        data: {
          publishedAt: new Date(),
          slug,
          name,
          description,
          fee,
          date,
          max_users,
          image,
          registration_end_date,
          registration_start_date,
          address_1,
          address_2,
          address_city,
          address_state,
          address_zip,
          start
        },
        fields: ["id", "name", "slug"], // Fields to be returned
      })
      .then((res) => {
        event.id = res.id;
        ctx.response.body = {
          data: res,
        };
        ctx.response.status = 200;
      })
      .catch((err) => {
        event.error = err;
        ctx.response.body = err;
        ctx.response.status = 500;
      });
  },

  async eventUpdate(ctx) {
    const {
      name,
      description,
      fee,
      date,
      max_users,
      image,
      registration_start_date,
      registration_end_date,
    } = ctx.request.body.data;
    const apiEvent = "api::event.event";

    let event = {
      id: null,
      error: null,
    };

    const slug = name.toLowerCase().replaceAll(/[^a-z0-9]+/gi, "-");
    console.log("[Event API] slug", slug);

    await strapi.entityService
      .create(apiEvent, {
        data: {
          publishedAt: new Date(),
          slug,
          name,
          description,
          fee,
          date,
          max_users,
          image,
          registration_end_date,
          registration_start_date,
        },
        fields: ["id", "name", "slug"], // Fields to be returned
      })
      .then((res) => {
        console.log("[Event API] event res", res);
        event.id = res.id;
        ctx.response.body = {
          data: res,
        };
        ctx.response.status = 200;
      })
      .catch((err) => {
        console.log("[Event API] event err", err);
        event.error = err;
        ctx.response.body = err;
        ctx.response.status = 500;
      });
  },

  // Rgister for events (create transaction, tee time, and )
  async eventRegister(ctx) {
    const token = jwt_decode(ctx.request.header.authorization);
    const payloadEvents = ctx.request.body.events; // Seed Data
    const payloadType = ctx.request.body.type;

    if (!payloadType && !payloadEvents) {
      ctx.response.status = 400;
      ctx.response.message = "Missing events and type.";
      return;
    }

    if (!payloadEvents) {
      ctx.response.status = 400;
      ctx.response.message = "Missing events.";
      return;
    }

    if (!payloadType) {
      ctx.response.status = 400;
      ctx.response.message = "Missing type.";
      return;
    }

    console.log("[Events Service] Register", {
      payloadEvents,
      payloadType,
      token,
    });

    // ctx.response.status = 500;
    // ctx.response.body = {
    //   token: jwt_decode(ctx.request.header.authorization),
    //   data: null,
    //   error: null,
    //   events: null,
    // }

    // Create a new transaction
    const transactionData = {
      events: payloadEvents,
      total: 0, // get from events
      success: true, // once the payment returns successfully set this
      user: [token.id],
      type: payloadType,
    };

    // Get and update all events
    const events = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: {
          $in: payloadEvents,
        },
      },
      populate: ["transactions", "users"],
      fields: ["id", "fee"],
    });

    // console.log("Events Before", events);

    // Create transaction total.
    transactionData.total = events.reduce((accumulator, object) => {
      return accumulator + object.fee;
    }, 0);

    // Create new transaction
    const transactionNew = await strapi.entityService.create(
      "api::transaction.transaction",
      {
        data: transactionData,
      }
    );

    // - Add user and transaction to existing arrays
    events.forEach((e) => {
      strapi.entityService.update("api::event.event", e.id, {
        data: {
          users: [...e.users, token.id],
        },
      });
    });

    // Update new transaction after payment resolves.
    // console.log("Events After", events);
    // ctx.response.body.events = events
    // ctx.response.body.data = transactionNew
    ctx.response.body = {
      events,
      transactionNew,
    };
    ctx.response.status = 200;

    if (transactionNew && events) {
      console.log("Transaction created.");
    }
  },
};
