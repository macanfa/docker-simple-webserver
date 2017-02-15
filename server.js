var cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    docRoot = __dirname + '/public',
    port = process.argv[2] || 3000

function getDateTime() {
    var date = new Date()
    var hour = date.getHours()
    hour = (hour < 10 ? "0" : "") + hour
    var min = date.getMinutes()
    min = (min < 10 ? "0" : "") + min
    var sec = date.getSeconds()
    sec = (sec < 10 ? "0" : "") + sec
    var milli = date.getMilliseconds()
    milli = (milli < 100 ? "0" : "") + milli
    milli = (milli < 10 ? "00" : "") + milli
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = (month < 10 ? "0" : "") + month
    var day = date.getDate()
    day = (day < 10 ? "0" : "") + day
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + milli
}


function logger(req, res) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    console.log(getDateTime() + "\t" + ip + "\t" + process.pid + "\t" + res.statusCode + "\t" + http.STATUS_CODES[res.statusCode] + "\t" + req.method + "\t" + req.url)
}

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork()
        console.log(getDateTime() + "\t" + 'Worker ' + i + ' started')
    }
    cluster.on('exit', function(worker, code, signal) {
        console.log(getDateTime() + "\t" + 'WorkerID ' + worker.process.pid + ' died')
        cluster.fork()
    })
} else {
    http.createServer(function(req, res) {

        var parsedUrl = url.parse(req.url),
            pathname = parsedUrl.pathname,
            ext = path.parse(pathname).ext || '.html',
            map = {
                '.ico': 'image/x-icon',
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
                '.svg': 'image/svg+xml',
                '.pdf': 'application/pdf',
                '.doc': 'application/msword'
            }

        fs.exists(docRoot + pathname, function(exist) {
            if (!exist) {
                res.statusCode = 404;
                res.end('ERROR 404 :"' + pathname + '" not found!')
                logger(req, res)
                return
            }
            if (fs.statSync(docRoot + pathname).isDirectory()) {
                pathname += '/index' + ext
            }
            fs.readFile(docRoot + pathname, function(err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end('Error getting the file: ' + err)
                } else {
                    res.setHeader('Content-type', map[ext] || 'text/plain')
                    res.end(data)
                }
                logger(req, res)
            })
        })
    }).listen(parseInt(port))
    console.log(getDateTime() + "\t" + 'Worker ClusterID :' + process.pid + ' Server listening on port : ' + port)
}