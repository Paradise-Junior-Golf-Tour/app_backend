module.exports = {
  // default res status is 404!!!!
  async findByEvent(ctx) {
    const { eventId } = ctx.request.query;
    console.log(eventId)

    // Override the default 404
    ctx.response.status = 500
    ctx.response.message = "An unknown error ocurred."

    if (!eventId) {
      ctx.response.status = 400
    }

    await strapi.entityService.findMany('api::transaction.transaction', {
      filters: {
        events: {
          id: {
            $eq: eventId
          }
       }
      },
      populate: ['user', 'events'],
      fields: ['*']
    }).then((transactions) => {
      ctx.response.status = 200;
      ctx.response.body = {
        data: transactions
      };
    }).catch((error) => {
      ctx.response.body = {
        error: error.stack.message
      };
    })
  },
};

