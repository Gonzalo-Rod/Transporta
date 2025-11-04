const jwt = require("jsonwebtoken");

function generateToken(user_info) {
	if (!user_info) {
		return null;
	}
	return jwt.sign(user_info, process.env.JWT_SECRET, { expiresIn: "3h" });
}

function verifyToken(userID, token) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded?.id !== userID) {
			return { verified: false, message: "invalid user" };
		}
		return { verified: true, message: "verified", response: decoded };
	} catch (error) {
		return { verified: false, message: "invalid token" };
	}
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
