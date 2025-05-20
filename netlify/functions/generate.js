// netlify/functions/generate.js

const fetch = require("node-fetch");
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
  const API_KEY = "ak_FWfDgcKCZyTDmGzCkMKtwrlFwo12VUHDnMO6N8KFwrPCn1QfPEnDgiFZwqHCk8Ks";
  const TARGET_URL = "https://www.flexiquiz.com/SC/N/8e9790e3-ae28-46ef-9d08-a62e712f90fc";

  const ip = getClientIp(event.headers);
  const ipLog = loadIpLog();

  if (ipLog.includes(ip)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "You have already generated your one-time link." })
    };
  }

  try {
    const res = await fetch("https://scrt.link/api/v1/secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        content: TARGET_URL,
        secretType: "redirect",
        expiresIn: 86400000,
        views: 1
      })
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "Failed to create secret", detail: result })
      };
    }

    ipLog.push(ip);
    saveIpLog(ipLog);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: `https://scrt.link/s#${result.secretLink.split("#")[1]}` })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message })
    };
  }
};
