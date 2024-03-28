const test = (req, res) => {
  res.status(200).send("api route is working");
};
const savePost = (req, res, next) => {};
module.exports = { test };
