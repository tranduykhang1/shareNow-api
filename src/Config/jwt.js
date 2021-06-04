const jwt = require("jsonwebtoken");
const config = require("../Env/jwtSecret.js");

module.exports = {
	signJwt(user) {
		const token = jwt.sign(
			{
				data: user,
			},
			config.jwtSecret,
			{ expiresIn: "5m" }
		);
		const refreshToken = jwt.sign({ data: user }, config.refreshToken, {
			expiresIn: "7d",
		});
		return {
			token: token,
			refreshToken: refreshToken,
		};
	},
	verifyRefreshToken(refreshToken, cb) {
		return new Promise((resolve, reject) => {
			jwt.verify(refreshToken, config.refreshToken, (err, decode) => {
				if (err) return reject(err);
				resolve(decode.data)
			});
		});
	},
	verifyJwt(req, res, next) {
		const { token } = req.query;
		if (token) {
			jwt.verify(token, config.jwtSecret, (err, result) => {
				if (err) return res.status(401).json("Verify fail! Token invalid");
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
				jwt.verify(token, config.jwtSecret, (err, result) => {
					if (err)
						return res.status(401).json("Verify fail! Token invalid");
					else {
						req.user = result.data;
						return next();
					}
				});
			} else {
				return next();
			}
		} else if (!token || !req.headers) {
			return res.status(401).json("Token no provider!");
		}
	},
	getDataToken(token) {
		let data;
		jwt.verify(token, config.jwtSecret, (err, result) => {
			if (err) return err;
			data = result.data;
		});
		return data;
	},
};
