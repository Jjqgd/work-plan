// netlify/functions/send-daily-check.js
// 钉钉推送代理（带加签）

const crypto = require('crypto');

const TOKEN = '162e271b16f090316ebf7bec83a9addcae2ae9dbafe1c8d5293c0a1c7eea9e0c';
const SECRET = 'SECc9ee5e38d415504f2d8ef65f53724a';

function sign(secret) {
    const timestamp = Date.now();
    const stringToSign = timestamp + '\n' + secret;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(stringToSign);
    const sign = encodeURIComponent(hmac.digest('base64'));
    return { timestamp, sign };
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ errcode: 405, errmsg: 'Method Not Allowed' })
        };
    }

    try {
        const { timestamp, sign: signed } = sign(SECRET);
        const url = `https://oapi.dingtalk.com/robot/send?access_token=${TOKEN}&timestamp=${timestamp}&sign=${signed}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body
        });
        const result = await response.json();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ errcode: 500, errmsg: error.message })
        };
    }
};
