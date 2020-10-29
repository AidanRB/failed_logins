var shifted = "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"
var unshifted = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
var last_time = new Date()

function activate(name, uppercase) {
    document.getElementsByName(name).forEach(key => {
        key.classList.add('pressed')
        if (uppercase) {
            key.classList.add('uppercase')
        }
    });
}

function deactivate(name, uppercase) {
    document.getElementsByName(name).forEach(key => {
        key.classList.remove('pressed')
        if (uppercase) {
            key.classList.remove('uppercase')
        }
    });
}

function press(id, timein, timeout, uppercase) {
    setTimeout(() => { activate(id, uppercase) }, timein)
    setTimeout(() => { deactivate(id, uppercase) }, timeout)
}

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

function log(data) {
    let table = document.getElementById('log')
    let row = table.insertRow(0)
    let timecell = row.insertCell(0)
    let ipcell = row.insertCell(1)
    let usercell = row.insertCell(2)
    let passcell = row.insertCell(3)
    timecell.innerHTML = Math.round((new Date() - last_time) / 100) / 10
    ipcell.innerHTML = data.ip
    usercell.innerHTML = data.username
    passcell.innerHTML = data.password
    passcell.onclick = function() { type(data.password) }

    if (table.rows.length > 15) {
        table.deleteRow(15)
    }

    last_time = new Date()
}



var connection = new WebSocket('ws://192.168.1.249/ws')

connection.onopen = function() {
    connection.send('Ping')
}

connection.onerror = function(error) {
    console.log('Websocket error: ' + error)
}

connection.onmessage = function(message) {
    console.log('Server: ' + message.data)
    data = JSON.parse(message.data)
    type(data.password)
    log(data)
    return false
}