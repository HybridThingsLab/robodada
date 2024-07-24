// we need these variables during development to mock otherwise broken functionality
// don't include this file in production

// used as dummy config in AvailableRobotsController
configTestData = {
    robot_ip: "192.168.188.36",
    frontend_location_relative: "./../../Userland/public",
    privateSSLKey_location_relative: "./cert/privkey.pem",
    publicCert_location_relative: "./cert/fullchain.pem",
    certifiedURL: "https://robodada.exampleurl.com",
};

// used as demo data in RoboChooserOverlayView
roboListTestData = [
    { name: "Robo Test Data", state: 1 },
    { name: "Number 1", state: 0 },
    { name: "Number 2", state: 1 },
    { name: "Number 3", state: 0 },
    { name: "Number 52", state: 1 },
    { name: "Number 21", state: 1 },
    { name: "Number 32", state: 0 },
];

currentRoboTestData = "Number 1";
