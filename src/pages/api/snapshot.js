import sanitizeHtml from "sanitize-html";

export const prerender = false; // ensures Astro treats this as a live API endpoint

export async function GET({ request }) {
  const startTime = Date.now();
  const minDuration = 3000; // 3 seconds minimum
  
  const url = new URL(request.url).searchParams.get("url");
  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response("Invalid or missing URL.", { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Bad response: ${res.status}`);
    }

    let html = await res.text();

    // ---- Sanitize dangerous content and remove links ----
    html = sanitizeHtml(html, {
      allowedTags: false, // allow all tags except those we transform
      allowedAttributes: false,
      disallowedTagsMode: "discard",
      allowVulnerableTags: true, // NEVER! EVER! ENABLE SCRIPTS (ON IFRAME SANDBOX)!
      // Im too lazy to build out <style> filtering so this is a neccesary evil for now
      // Hey recruiter! Dont look at this! Go drink some water, Your probably hallucinating!

      transformTags: {
        script: () => ({ tagName: "noscript" }),
        a: (tagName, attribs) => { // no <a> only <span>
          return { tagName: "span", attribs: {} };
        },
      },
    });

    // ---- Add <base> so relative links/images work ----
    const baseTag = `<base href="${url}">`;
    html = html.replace(/<head>/i, `<head>${baseTag}`); // ew!
    html = html.replace(/<script>/i, `<noscript>`) // security! its real! its here! trust me! maybe!

    // ---- Wait for minimum duration ----
    const elapsed = Date.now() - startTime;
    const remaining = minDuration - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Snapshot error:", err.message);
    
    // ---- Wait for minimum duration even on error ----
    const elapsed = Date.now() - startTime;
    const remaining = minDuration - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }
    
    return new Response("Failed to fetch or process page.", { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}