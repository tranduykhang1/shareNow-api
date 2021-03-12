const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../Env/jwtSecret.js");

module.exports = {
	signJwt(user) {
		const token = jwt.sign(
			{
				data: user,
			},
			jwtSecret,
			{ expiresIn: "1h" }
		);
		return token;
	},
	verifyJwt(req, res, next) {
		const { token } = req.query;
		if (token) {
			jwt.verify(token, jwtSecret, (err, result) => {
				if (err) return res.status(403).json("Verify fail! Token invalid");
				else {
					req.user = result.data;
					return next();
				}
			});
		}
		if (
			req.headers &&
			req.headers.authorization &&
			req.headers.authorization.split(" ")[0]
		) {
			const token = req.headers.authorization.split(" ")[1];
			if (token) {
				jwt.verify(token, jwtSecret, (err, result) => {
					if (err)
						return res.status(403).json("Verify fail! Token invalid");
					else {
						req.user = result.data;
						return next();
					}
				});
			}
			else{
				return next();
			}
		}
		else if (!token || !req.headers){
			return res.status(403).json("Token no provider!")
		}
	},
};
