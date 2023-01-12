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