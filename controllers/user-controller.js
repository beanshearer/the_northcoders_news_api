const { fetchUser } = require('../models/user-model')

const sendUser = (req, res, next) => {
    console.log(req, 'reaching sendUser')
    // fetchUser().then(user => {
    //     res.status(200).send({ user })
    // }).catch(err => next(err));
}


module.exports = { sendUser };
