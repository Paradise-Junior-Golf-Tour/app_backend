module.exports = {
  async index(ctx, next) { // called by GET /hello 
    ctx.response.status = 200; // we could also send a JSON

    const entry = await strapi.entityService.findMany('api::event.event', {
      populate: ['tee_time.time_slots.participants']
    });

    console.log('Log', entry);

    ctx.response.body = {
      data: { ...entry }
    };
  },

  async all(ctx, next) { // called by GET /hello 
    ctx.response.status = 200; // we could also send a JSON

    // const entry = await strapi.entityService.findMany('api::tee-time.tee-time', {
    //   populate: ['name', 'participants', 'event', 'time_slot']
    //   // populate: '*'
    // });

    const updated = await strapi.entityService.update('api::tee-time.tee-time', 1, {
      data: {
        name: "David Bowie Party of 3"
      }
    });

    const all = await strapi.entityService.findMany('api::tee-time.tee-time', {
      // populate: ['name', 'participants', 'event', 'time_slot', '*']
      populate: '*'
    });

    ctx.response.body = {
      data: { tee_time_updated: updated, tee_time_all: all }
    };
  },
};

