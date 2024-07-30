config = {
    robot_ip: "192.168.188.36",
    frontend_location_relative: "./../../Userland/public",
    privateSSLKey_location_relative: "/etc/letsencrypt/live/robots.hybridthings.com/privkey.pem",
    publicCert_location_relative: "/etc/letsencrypt/live/robots.hybridthings.com/fullchain.pem",
    certifiedURL: "https://robots.hybridthings.com"
}

module.exports = config;