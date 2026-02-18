// pm2 reload ecosystem.config.js
module.exports = {
    apps : [{
        name: "heardle_server",
        script: "./heardle_server/main.ts",
        interpreter: "deno",
        // TODO: reduce permissions to explicit allow list
        interpreter_args: "run -A",
    }, {
        name: "home_server",
        script: "./home_server/main.ts",
        interpreter: "deno",
        interpreter_args: "run -A",
    }],
};
