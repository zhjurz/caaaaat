class CCC {
  enc = ["c", "C", "с", "ϲ"];
  dec = {
    c: "0",
    C: "1",
    с: "2",
    ϲ: "3",
  };
  ver = { cccc: true };
  currVer = "cccc";

  removeAndCheckVersion(ccc) {
    return this.ver[ccc.substring(0, 4)] ? ccc.substring(4) : null;
  }

  addVersion(ccc) {
    return this.currVer + ccc;
  }

  encodeUrl(url) {
    let unversioned = this.toUTF8Array(url)
      .map((n) => n.toString(4).padStart(4, "0"))
      .join("")
      .split("")
      .map((x) => this.enc[parseInt(x)])
      .join("");
    return this.addVersion(unversioned);
  }

  decodeUrl(ccc) {
    ccc = this.removeAndCheckVersion(ccc);
    if (ccc === null) return null;

    let b4str = ccc
      .split("")
      .map((x) => this.dec[x])
      .join("");

    let utf8arr = [];
    for (let i = 0; i < b4str.length; i += 4) {
      utf8arr.push(parseInt(b4str.substring(i, i + 4), 4));
    }

    return new TextDecoder().decode(new Uint8Array(utf8arr));
  }

  toUTF8Array(str) {
    return new TextEncoder().encode(str);
  }
}

// ⭐ 内嵌首页（简单版）
const INDEX_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CCC Encoder</title>
</head>
<body>
  <h2>CCC URL Encoder</h2>
  <input id="url" placeholder="https://example.com" style="width:300px;">
  <button onclick="gen()">生成</button>
  <p id="out"></p>

  <script>
    function gen() {
      const url = document.getElementById('url').value;
      fetch('/encode?url=' + encodeURIComponent(url))
        .then(r => r.text())
        .then(t => {
          const link = location.origin + '/' + t;
          document.getElementById('out').innerHTML =
            '<a href="'+link+'" target="_blank">'+link+'</a>';
        });
    }
  </script>
</body>
</html>
`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = decodeURIComponent(url.pathname.slice(1));

    const ccc = new CCC();

    // ✅ 1. 首页
    if (!path) {
      return new Response(INDEX_HTML, {
        headers: { "content-type": "text/html" },
      });
    }

    // ✅ 2. 编码接口
    if (url.pathname.startsWith("/encode")) {
      const target = url.searchParams.get("url");
      if (!target) return new Response("missing url", { status: 400 });

      return new Response(ccc.encodeUrl(target));
    }

    // ✅ 3. 解码跳转
    let redirectUrl = null;
    try {
      redirectUrl = ccc.decodeUrl(path);
    } catch (e) {}

    if (!redirectUrl) {
      return new Response("Invalid CCC URL", { status: 404 });
    }

    if (!redirectUrl.startsWith("http")) {
      redirectUrl = "https://" + redirectUrl;
    }

    return Response.redirect(redirectUrl, 302);
  },
};