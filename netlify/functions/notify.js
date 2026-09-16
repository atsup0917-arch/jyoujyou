// OneSignal REST APIキーをサーバー側（Netlify環境変数）に隠し、
// クライアントからはこの関数経由でのみプッシュ通知を送信する。
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !apiKey) {
    return { statusCode: 500, body: "OneSignal env vars not configured" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const title = String(payload.title || "上々 業務アプリ").slice(0, 100);
  const message = String(payload.message || "").slice(0, 300);
  if (!message) {
    return { statusCode: 400, body: "message is required" };
  }

  try {
    const res = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Total Subscriptions"],
        headings: { en: title, ja: title },
        contents: { en: message, ja: message },
      }),
    });
    const text = await res.text();
    return { statusCode: res.ok ? 200 : 502, body: text };
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message || e) };
  }
};
