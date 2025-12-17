const jwt = require('jsonwebtoken'); // Import jsonwebtoken for verifying tokens

// Middleware to authenticate requests using JWT
const auth = (req, res, next) => {
    // console.log("Auth Middleware Headers:", req.headers);
    // Check for the token in the 'Authorization' header or query string
    let token = req.headers.authorization || req.query.Authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "No token provided" });
    }

    // Handle Bearer authentication (common in frontend frameworks)
    // Removes the 'Bearer ' prefix to extract the raw token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded JWT:", decoded);

        // Attach user data to the request object for use in subsequent routes/controllers
        req.userdata = { id: decoded.userId, email: decoded.email, username: decoded.username };
        req.user = decoded; // Store the full decoded payload as 'req.user' as well for flexibility

        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ error: "Unauthorized", message: err.message });
    }
}

module.exports = auth;