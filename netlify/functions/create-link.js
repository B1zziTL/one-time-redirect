const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const API_KEY = "ak_FWfDgcKCZyTDmGzCkMKtwrlFwo12VUHDnMO6N8KFwrPCn1QfPEnDgiFZwqHCk8Ks"; // from your scrt.link account
  const ORIGINAL_URL = "https://www.flexiquiz.com/SC/N/8e9790e3-ae28-46ef-9d08-a62e712f90fc";

  try {
    const res = await fetch("https://scrt.link/api/v1/secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        content: ORIGINAL_URL,
        secretType: "redirect",
        expiresIn: 86400000,
        views: 1
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "scrt.link failed", detail: errText })
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ url: data.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message })
    };
  }
}

    };
  }
}
