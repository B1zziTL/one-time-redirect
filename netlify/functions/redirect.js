// netlify/functions/redirect.js

const FLEXIQUIZ_URL = "https://www.flexiquiz.com/SC/N/8e9790e3-ae28-46ef-9d08-a62e712f90fc";

// Optional: You can add code-level validation logic here if needed

exports.handler = async function (event) {
  const { id } = event.queryStringParameters || {};

  // You could validate id here if you're using codes like ?id=XYZ
  if (!id || id.length < 3) {
    return {
      statusCode: 400,
      body: "Missing or invalid access ID."
    };
  }

  return {
    statusCode: 302,
    headers: {
      Location: FLEXIQUIZ_URL
    }
  };
};
