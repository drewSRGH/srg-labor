exports.handler = async (event) => {
  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const apiKey = process.env.SEVEN_SHIFTS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "SEVEN_SHIFTS_API_KEY env var not set in Netlify" })
    };
  }

  const params = { ...(event.queryStringParameters || {}) };
  const apiPath = params.path || "/v2/company";
  delete params.path;

  const qs = Object.keys(params).length > 0
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const url = `https://api.7shifts.com${apiPath}${qs}`;

  try {
    const resp = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    const data = await resp.json();
    return { statusCode: resp.status, headers: CORS, body: JSON.stringify(data) };
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
