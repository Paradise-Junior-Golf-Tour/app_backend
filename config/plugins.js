module.exports = ({ env }) => ({
    // ...
    slugify: {
        enabled: true,
        config: {
            contentTypes: {
                event: {
                    field: 'Slug',
                    references: 'Name',
                },
            },
        },
    },
    'users-permissions': {
        config: {
          jwt: {
            expiresIn: '15d',
          },
        },
      },
    // ...
});

// module.exports = ({ env }) => ({
//     // ...
//     'users-permissions': {
//       config: {
//         jwt: {
//           expiresIn: '7d',
//         },
//       },
//     },
//     // ...
//   });

module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  // ...
});