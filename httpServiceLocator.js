const request = require('request');

const httpServiceLocator = function () {
};

httpServiceLocator.prototype = {
    send: function (url, method, body, isEncoded = false, returnHeaders = false) {
        return new Promise((resolve, reject) => {
            try {
                //common.emit('log', 'START httpServiceLocator\nsend function with Url: ' + url + '\nAuthorization: ' + authorization + '\nMethod: ' + method + '\nBody:' + JSON.stringify(body), 'log');
                let encoded_url = isEncoded ? url : encodeURI(url);

                request[method]({
                        url: encoded_url,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        json: body,
                        rejectUnauthorized: false
                    },
                    function (error, response) {
                        if (error || (response.statusCode !== 200 && response.statusCode !== 201 && response.statusCode !== 204)) {
                            //common.emit('log', 'Failed finished httpServiceLocator\nsend function with Url: ' + url + '\nAuthorization: ' + authorization + '\nMethod: ' + method + '\nBody:' + JSON.stringify(body) + '\nRESPONSE: ' + JSON.stringify(response) + '\nERROR: ' + JSON.stringify(error), 'error');
                            return reject(error || response);
                        }
                        else {
                            //common.emit('log', 'Success finished httpServiceLocator\nsend function with url: ' + url + '\nAuthorization: ' + authorization + '\nMethod: ' + method + '\nBody:' + JSON.stringify(body) + '\nRESULT: ' + JSON.stringify(response.body), 'log');
                            return !returnHeaders ? resolve(response.body) : resolve(response.headers);
                        }
                    }
                );
            }
            catch (err) {
                //common.emit('log', 'EXCEPTION - Failed finished httpServiceLocator - send function,\nerror:' + JSON.stringify(err), 'error');
                return reject(err);
            }
        });
    }
};

let instance = new httpServiceLocator();
module.exports = instance;

