/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    appDirectory: "app",
    assetsBuildDirectory: "public/build",
    future: {
        /* any enabled future flags */
    },
    ignoredRouteFiles: ["**/*.css"],
    publicPath: "/build/",
    serverBuildPath: "build/index.js",
};
