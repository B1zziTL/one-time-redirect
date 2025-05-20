// netlify/functions/check-ip.js
const fs = require("fs");
const path = require("path");

const IP_LOG_PATH = path.join(__dirname, "ip-log.json");

function getClientIp(headers) {
  return (
    headers["x-forwarded-for"]?.split(",")[0] ||
    headers["client-ip"] ||
    headers["x-real-ip"] ||
    "unknown"
  );
}

function loadIpLog() {
  try {
    const data = fs.readFileSync(IP_LOG_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveIpLog(ips) {
  fs.writeFileSync(IP_LOG_PATH, JSON.stringify(ips, null, 2));
}

exports.handler = async function (event, context) {
  const ip = getClientIp(event.headers);
  const ipLog = loadIpLog();

  if (ipLog.includes(ip)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "You have already generated your one-time link." })
    };
  }

  ipLog.push(ip);
  saveIpLog(ipLog);

  return {
    statusCode: 200,
    body: JSON.stringify({ accessGranted: true })
  };
};
