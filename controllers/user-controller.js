const { fetchUser } = require('../models/user-model')

const sendUser = (req, res, next) => {
    fetchUser(req.params).then(user => {
        res.status(200).send({ user })
    }).catch(err => next(err));
}


module.exports = { sendUser };
