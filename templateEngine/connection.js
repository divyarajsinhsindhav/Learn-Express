const mysql = require('mysql2')

const mySqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1290578',
    database: 'OnlineStore',
    port: 3307
})

const connection = mySqlConnection.connect((err) => {
    if(err) {
        console.error('Error', err)
    } else {
        console.log('Connection successful')
    }
})

module.exports = mySqlConnection