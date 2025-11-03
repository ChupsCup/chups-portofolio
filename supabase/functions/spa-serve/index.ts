// Deno Deploy-style Edge Function to serve SPA from Supabase Storage public bucket
// Bucket name: "spa" (public). Upload your build output (dist/*) into this bucket.
// This function serves assets with content-type and falls back to index.html for SPA routing.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CONTENT_TYPE: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function ext(path: string) {
  const i = path.lastIndexOf(".");
  return i >= 0 ? path.slice(i) : "";
}

function contentType(path: string) {
  return CONTENT_TYPE[ext(path)] ?? "application/octet-stream";
}

serve(async (req) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path === "/") path = "/index.html";
  const clean = path.replace(/^\/+/, "");

  const base = Deno.env.get("SUPABASE_URL");
  if (!base) return new Response("Missing SUPABASE_URL", { status: 500 });

  const publicURL = `${base}/storage/v1/object/public/spa/${clean}`;
  let res = await fetch(publicURL, { headers: { accept: "*/*" } });

  if (!res.ok) {
    // SPA fallback
    const fallbackURL = `${base}/storage/v1/object/public/spa/index.html`;
    const fb = await fetch(fallbackURL, { headers: { accept: "text/html" } });
    if (!fb.ok) return new Response("index.html not found in 'spa' bucket", { status: 404 });
    const html = await fb.text();
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
        "access-control-allow-origin": "*",
      },
    });
  }

  // stream asset
  const mime = contentType(clean);
  const body = res.body;
  const headers = new Headers(res.headers);
  headers.set("content-type", mime);
  headers.set("access-control-allow-origin", "*");
  return new Response(body, { status: 200, headers });
});
