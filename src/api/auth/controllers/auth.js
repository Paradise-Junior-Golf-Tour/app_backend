// TODO - Move to a new auth api
module.exports = {
    async refreshToken(ctx) {
        const newJwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: ctx.state.user.id
        })
        return { jwt: newJwt }
    },
}