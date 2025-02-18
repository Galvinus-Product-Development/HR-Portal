const crypto = require("crypto");

const getDeviceInfo = (req, res, next) => {
    // Capture device info from the body or headers
    let deviceId = req.body.deviceId || req.headers["x-device-id"];
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Generate a unique device ID if not provided
    if (!deviceId) {
        console.log("Entered.........")
        deviceId = crypto.createHash("sha256").update(userAgent + ipAddress).digest("hex");
    }

    // Validate userAgent and IP
    if (!userAgent) {
        return res.status(400).json({ error: "User agent is required" });
    }

    if (!ipAddress) {
        return res.status(400).json({ error: "IP address is required" });
    }

    // Attach device info to the request body for further use
    req.body.deviceId = deviceId;
    req.body.userAgent = userAgent;
    req.body.ipAddress = ipAddress;

    next();
};

module.exports = getDeviceInfo;
