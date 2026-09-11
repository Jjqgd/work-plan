// netlify/functions/send-daily-check.js
// 与日检查总结共用同一个钉钉机器人

const TOKEN = '162e271b16f090316ebf7bec83a9addcae2ae9dbafe1c8d5293c0a1c7eea9e0c';
const DINGTALK_WEBHOOK = `https://oapi.dingtalk.com/robot/send?access_token=${TOKEN}`;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ errcode: 405, errmsg: 'Method Not Allowed' })
        };
    }

    try {
        const response = await fetch(DINGTALK_WEBHOOK, {
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
