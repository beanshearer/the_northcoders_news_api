exports.routeNotFound = (req, res) => {
    res.status(404).send({ msg: 'Route Not Found' });
  };
  
exports.methodNotAllowed = (req, res) => {
  console.log(res, "<---")
    res.status(405).send({ msg: 'Method Not Allowed' });
  };
  
exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Internal Server Error' });
  };
  
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.message) {

      res.status(err.status).send({ msg : err.message});
    } else {
      next(err)
    }

  };
  
  // exports.handleCustomErrors = (err, req, res, next) => {
  //   console.log(err)
  //   res.status(err.status).send(err.message);
  // };