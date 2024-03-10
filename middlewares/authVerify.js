import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ error: "UnAuthorized" });
    }
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({ error: "Invalid Token" })
        }
        req.user = user;
        next();
    })


}