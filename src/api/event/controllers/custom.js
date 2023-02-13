const jwt_decode = require("jwt-decode");

module.exports = {
  // default res status is 404!!!!

  // FETCH ALL EVENTS AND THEIR CORRESPONDING TEE TIMES/PARTICIPANTS
  async findAll(ctx) {
    // called by GET /hello
    ctx.response.status = 200; // we could also send a JSON
    const all = await strapi.entityService.findMany("api::event.event", {
      // populate: ['participants', 'tee_time.time_slots.tee-time', '  tee_time.time_slots.participants'],
      populate: ["transactions", "users", "tee-time"],
      fields: ["*"],
    });

    // Get users, teetimes, etc.

    ctx.response.body = {
      data: all,
    };
  },

  async findUserEvents(ctx) {
    const { identifier } = ctx.request.query;
    console.log({ id: identifier, ctx });

    const event = await strapi.entityService.findOne(
      "api::event.event",
      parseInt(identifier),
      {
        populate: ["users"],
        fields: ["*"],
      }
    );

    console.log(`[Event API] findUserEvents`, event);

    ctx.response.body = event;
    ctx.response.status = 200;
  },

  // CREATE NEW EVENT AND TEE TIME
  async createNew(ctx) {
    const { name, description, fee, date, max_users, image } = ctx.request.body.data;
    const apiEvent = "api::event.event";

    console.log("EVENT NEW START PAYLOAD", { name, description });

    let event = {
      id: null,
      error: null,
    };
    let teeTime = {
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
          image
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

    if (event) {
      await strapi.entityService
        .create("api::tee-time.tee-time", {
          data: {
            Name: name,
            event: [event.id],
            publishedAt: new Date(),
          },
        })
        .then((res) => {
          teeTime.id = res.id;
        })
        .catch((err) => {
          teeTime.error = err;
        });
    }

    // if (!event.id) {
    //   ctx.response.status = event.error.name === "ValidationError" ? 409 : 500;
    //   ctx.response.body = {
    //     message: `Failed to create the event ${eventName} and its corresponding tee time. ${event.error.name === "ValidationError" ? "This event already exists." : "An unspecified error has occurred."}`,
    //     error: event.error
    //   };
    // }

    // if (event.id && teeTime.id) {
    //   ctx.response.status = 201;
    //   ctx.response.body = {
    //     message: `Successfully created the event ${eventName} and its corresponding tee time.`,
    //     data: {
    //       event: {
    //         name: eventName,
    //         id: event.id
    //       },
    //       teeTime: {
    //         id: teeTime.id
    //       }
    //     }
    //   };
    // }

    // if (event.id && !teeTime.id) {
    //   ctx.response.status = 500;
    //   ctx.response.body = {
    //     message: `Successfully created event ${eventName} (id: ${event.id}) but failed to create the corresponding tee time. Either manually create this event in the Admin Dashboard or contact your developer.`,
    //     error: teeTime.error
    //   };
    // }
  },

  // Rgister for events (create transaction, tee time, and )
  async register(ctx) {
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
      // populate: ['participants', 'tee_time.time_slots.tee-time', '  tee_time.time_slots.participants'],
      filters: {
        id: {
          $in: payloadEvents,
        },
      },
      populate: ["transactions", "users"],
      fields: ["id", "Fee"],
    });

    console.log("Events Before", events);

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
    console.log("Events After", events);
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
