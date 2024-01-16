export const createUserVaidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at 5 characters with max of 32 characters!",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
    notEmpty: {
      errorMessage: "Username cannot be empyt!",
    },
  },
  displayname: {
    notEmpty: true,
  },
};
