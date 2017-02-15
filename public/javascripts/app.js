//
//  Page Functions & Tools
//
function prettify(obj) {
    return JSON.stringify(obj, null, 2);
}

function callback(data) {
    if (data) {
        result.innerHTML = prettify(data)
    }
}

//
//  ToolFunctions
//
function sortArray(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var milli = date.getMilliseconds();
    milli = (milli < 100 ? "0" : "") + milli;
    milli = (milli < 10 ? "00" : "") + milli;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + milli;
}

function bytesToSize(bytes) {
    if (bytes == 0) return '0 Byte';
    var k = 1024
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}

function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function normalizeData() {
    data = document.getElementById("body").value
    link = document.getElementById("link").value || document.URL
    document.getElementById("body").value = parseTXT(generateUUID(), link, data)
}

//
//  jQuery API Calls
//
function restFul(callback) {
    var url = document.getElementById("url").value,
        methode = document.getElementById("methode").value,
        headers = { "Api-Key": document.getElementById("api-key").value }

    switch (methode) {
        case 'POST':
        case 'PUT':
            data = document.getElementById("body").value
            break
        default:
            data = ''
            break
    }

    $.ajax({
        url: url,
        headers: headers,
        type: methode,
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function(data, textStatus, jqXHR) {
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback(jqXHR)
        }
    })
    return false;

}