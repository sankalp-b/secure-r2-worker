export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean);

      if (parts[0] !== "secure" || !parts[1]) {
        return new Response("Not found", { status: 404 });
      }

      const filename = parts[1].toLowerCase();
      const object = await env.FLAGS.get(filename);

      if (!object) {
        return new Response("File not found in R2", { status: 404 });
      }

      let contentType = "application/octet-stream";
      if (filename.endsWith(".svg")) contentType = "image/svg+xml";
      else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (filename.endsWith(".png")) contentType = "image/png";

      return new Response(object.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    } catch (err) {
      return new Response("Worker error: " + err.message, { status: 500 });
    }
  }
};