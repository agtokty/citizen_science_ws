var exp = require('express');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appConfig = require('./appConfig');


function getParam(argv, paramName) {
    if (argv.indexOf(paramName) != -1)
        return argv[argv.indexOf(paramName) + 1];
    else
        return null;
}

var defaultEnv = "dev";
var PORT = 80

var envParam = getParam(process.argv, "--env");
if (envParam) {
    if (envParam == "dev" || envParam == "test")
        defaultEnv = envParam;
}

var portParam = getParam(process.argv, "--port");
if (portParam && !isNaN(portParam)) {
    PORT = portParam;
} else if (appConfig.port && !isNaN(appConfig.port)) {
    PORT = appConfig.port;
}

var app = exp();
app.use(bodyParser.json());

var api = require('./routes/api');

app.use('/api', api);

app.listen(process.env.PORT || PORT, function () {
    console.log("Web API started at : " + PORT)
});