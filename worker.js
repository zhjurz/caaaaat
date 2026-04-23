class CCC {
  enc = ["c", "C", "с", "ϲ"];
  dec = { c: "0", C: "1", с: "2", ϲ: "3" };
  ver = "cccc";

  decodeUrl(str) {
    try {
      if (!str.startsWith(this.ver)) return null;
      str = str.slice(4);

      let b4 = "";
      for (let ch of str) {
        if (!(ch in this.dec)) return null;
        b4 += this.dec[ch];
      }

      if (b4.length % 4 !== 0) return null;

      let bytes = [];
      for (let i = 0; i < b4.length; i += 4) {
        let num = parseInt(b4.slice(i, i + 4), 4);
        if (isNaN(num)) return null;
        bytes.push(num);
      }

      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
      return null;
    }
  }
}

// 防止 URL 编码问题
function safeDecode(path) {
  try {
    let once = decodeURIComponent(path);
    try {
      return decodeURIComponent(once);
    } catch {
      return once;
    }
  } catch {
    return path;
  }
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = safeDecode(url.pathname.slice(1));
      const ccc = new CCC();

      // ✅ 静态资源
      if (
        url.pathname === "/" ||
        url.pathname.startsWith("/index") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".html")
      ) {
        return env.ASSETS.fetch(request);
      }

      // ✅ 解码跳转
      const target = ccc.decodeUrl(path);

      if (!target) {
        return env.ASSETS.fetch(new Request(url.origin));
      }

      let finalUrl = target;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }

      return Response.redirect(finalUrl, 302);
    } catch {
      return new Response("Internal Error", { status: 500 });
    }
  },
};
