exports.authorization = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).send({ status: "User not found" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ status: "Unauthorized!" });
        }
        next();
    };
};
