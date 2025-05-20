export async function handler(event, context) {
  const API_KEY = "ak_FWfDgcKCZyTDmGzCkMKtwrlFwo12VUHDnMO6N8KFwrPCn1QfPEnDgiFZwqHCk8Ks";
  const ORIGINAL_URL = "https://unique-flexiquiz-link.netlify.app";

  try {
    const res = await fetch("https://scrt.link/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        type: "redirect",
        content: ORIGINAL_URL,
        expireAfterViews: 1,
        expireAfter: "1d"
      })
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "Failed to create scrt.link" })
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
      body: JSON.stringify({ error: "Server error" })
    };
  }
}
