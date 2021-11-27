const express = require("express");
const request = require("request");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

app.all("*", function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        req.header("access-control-request-headers")
    );

    if (req.method === "OPTIONS") {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header("Target-URL"); // Target-URL ie. https://example.com or http://example.com
        if (!targetURL) {
            res.status(500).send({
                error: "There is no Target-Endpoint header in the request",
            });
            return;
        }
        request(
            {
                url: targetURL + req.url,
                method: req.method,
                json: req.body,
                headers: {Authorization: req.header("Authorization")},
            },
            function (error, response, body) {
                if (error) {
                    console.error("error: " + response.statusCode);
                }
                //                console.log(body);
            }
        ).pipe(res);
    }
});

app.listen(PORT, (req, res) => {
    console.log(`Proxy Server running on port ${PORT}`);
});
