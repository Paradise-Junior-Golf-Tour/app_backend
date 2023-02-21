module.exports = ({ env }) => ({
  // ...
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        event: {
          field: "Slug",
          references: "Name",
        },
      },
    },
  },
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "15d",
      },
    },
  },
  // ...
});

module.exports = ({ env }) => ({
  // ...
  upload: {
    config:
      process.env.NODE_ENV === "production"
        ? {
            provider: "cloudinary",
            providerOptions: {
              cloud_name: env("CLOUDINARY_NAME"),
              api_key: env("CLOUDINARY_KEY"),
              api_secret: env("CLOUDINARY_SECRET"),
            },
            breakpoints: {
              xlarge: 1920,
              large: 1000,
              medium: 750,
              small: 500,
              xsmall: 64,
            },
            actionOptions: {
              upload: {},
              delete: {},
            },
          }
        : null,
  },
  // ...
});
