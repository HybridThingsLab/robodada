# ROBODADA Userland

## Dev/Build Setup

We are using BrowserSync to serve the files. SASS and PostCSS to create autoprefixed and minified styles. All settings and tasks are found in the `package.json`.

-   Install packages using `npm install` - be sure to have the correct npm version active. See `package.json` for more information.
-   run `npm run start` to fire up browsersync
-   run `npm run build` to create minifed file for new release

> During development, we are loading `js/test-data.js` in the html footer to mock otherwise broken functionality. The file musn't be loaded in a live setting.
