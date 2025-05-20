const { createSecret } = require("scrt-link-node");

const API_KEY = "ak_FWfDgcKCZyTDmGzCkMKtwrlFwo12VUHDnMO6N8KFwrPCn1QfPEnDgiFZwqHCk8Ks";
const QUIZ_URL = "https://www.flexiquiz.com/SC/N/8e9790e3-ae28-46ef-9d08-a62e712f90fc";

const generateOTP = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

let issuedCodes = {}; // { ip: { code, link } }

function getClientIp(headers) {
  return (
    headers["x-forwarded-for"]?.split(",")[0] ||
    headers["client-ip"] ||
    headers["x-real-ip"] ||
    "unknown"
  );
}

exports.handler = async function (event) {
  const ip = getClientIp(event.headers);

  if (issuedCodes[ip]) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Code already issued for this IP.",
      }),
    };
  }

  const code = generateOTP();

  try {
    const scrtRes = await fetch("https://scrt.link/api/v1/client-module");
    const { scrtLink } = await import("https://scrt.link/api/v1/client-module");
    const client = scrtLink(API_KEY);

    const result = await client.createSecret(QUIZ_URL, {
      secretType: "redirect",
      expiresIn: 86400000,
      views: 1,
    });

    const oneTimeUrl = `https://scrt.link/s#${result.secretLink.split("#")[1]}`;
    issuedCodes[ip] = { code, link: oneTimeUrl };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Here is your one-time code and access link.",
        code,
        link: oneTimeUrl,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create redirect", detail: err.message }),
    };
  }
};
