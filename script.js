var shifted = "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"
var unshifted = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
var last_time = new Date()

// Key on
function activate(name, uppercase) {
    document.getElementsByName(name).forEach(key => {
        key.classList.add('pressed')
        if (uppercase) {
            key.classList.add('uppercase')
        }
    });
}

// Key off
function deactivate(name, uppercase) {
    document.getElementsByName(name).forEach(key => {
        key.classList.remove('pressed')
        if (uppercase) {
            key.classList.remove('uppercase')
        }
    });
}

// Press a key
function press(id, timein, timeout, uppercase) {
    setTimeout(() => { activate(id, uppercase) }, timein)
    setTimeout(() => { deactivate(id, uppercase) }, timeout)
}

// Show string on the keyboard
function type(string) {
    document.getElementsByName('space')[0].innerHTML = string

    for (let i = 0; i < string.length; i++) {
        if (string[i] === ' ') {
            press('space', i * 100, i * 100 + 100, false)
        }
        if (shifted.indexOf(string[i]) == -1) {
            press(string[i], i * 100, i * 100 + 100, false)
        } else {
            press(unshifted[shifted.indexOf(string[i])], i * 100, i * 100 + 100, true)
        }
    }
}

// Get location of IP
function locate(element, ip) {
    let ipdataxhr = new XMLHttpRequest()
    ipdataxhr.open('GET', 'http://api.ipstack.com/' + ip + '?access_key=bc21f33f31f8bf712803f33be92d172f&format=1', false)
        //ipdataxhr.responseType = 'json'
    ipdataxhr.send()
    let response = JSON.parse(ipdataxhr.response)
    element.innerHTML = response.response.country_code + response.location.country_flag_emoji
}

// Add entry to table
function log(data) {
    let table = document.getElementById('log')
    let row = table.insertRow(0)
    let passcell = row.insertCell(0)
    let usercell = row.insertCell(0)
    let loccell = row.insertCell(0)
    let ipcell = row.insertCell(0)
    let timecell = row.insertCell(0)
    timecell.innerHTML = Math.round((new Date() - last_time) / 100) / 10
    ipcell.innerHTML = data.ip
    ipcell.onclick = function() { locate(loccell, data.ip) }
    usercell.innerHTML = data.username
    passcell.innerHTML = data.password
    passcell.onclick = function() { type(data.password) }

    if (table.rows.length > 15) {
        table.deleteRow(15)
    }

    last_time = new Date()
}


// Set up websocket
var connection = new WebSocket('ws://' + location.host + '/ws')

connection.onopen = function() {
    connection.send('Ping')
}

connection.onerror = function(error) {
    console.log('Websocket error: ' + error)
}

// Do things when message recieved
connection.onmessage = function(message) {
    console.log('Server: ' + message.data)
    data = JSON.parse(message.data)
    type(data.password)
    log(data)
    return false
}