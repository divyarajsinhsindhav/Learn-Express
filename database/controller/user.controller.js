const User = require('../model/user.model')

exports.createUser = async (req, res) => {
    const body = req.body;
    const result = await User.create({
        userName: body.userName,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        jobTitle: body.jobTitle
    });
    return res.status(201).json({ result: result });
}

exports.getUser = async (req, res) => {
    const allUser = await User.find({})
    // allUser.forEach((user) => {
    //     console.log("user: ", user.email);
    // });
    return res.status(200).json({ allUser });
}

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.id);
    return res.status(200).json({ user });
}

exports.updateUser = async (req, res) => {
    const body = req.body;
    await User.findByIdAndUpdate(req.params.id, {
        userName: body.userName,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        jobTitle: body.jobTitle,
    })
    return res.json({ status: 'User updated' });
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: 'User deleted' })
}