// netlify/functions/otp.js

const generateOTP = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

let issuedCodes = {}; // { ip: code }

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
        message: "Code already issued for this IP."
      })
    };
  }

  const code = generateOTP();
  issuedCodes[ip] = code;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Here is your one-time code.",
      code
    })
  };
};
