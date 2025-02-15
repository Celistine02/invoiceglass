const net = require('net');

const checkSmtpConnection = () => {
    const options = {
        port: 465,
        host: 'smtp.gmail.com',
        timeout: 5000
    };

    const client = net.createConnection(options, () => {
        console.log('Connected to SMTP server');
        client.end();
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
    });

    client.on('timeout', () => {
        console.error('Connection timed out');
        client.end();
    });
};

module.exports = checkSmtpConnection;
