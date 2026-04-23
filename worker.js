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
    if (!ccc || ccc.length < 4) return null;
    return this.ver[ccc.substring(0, 4)] ? ccc.substring(4) : null;
  }

  addVersion(ccc) {
    return this.currVer + ccc;
  }

  encodeUrl(url) {
    try {
      let unversioned = this.toUTF8Array(url)
        .map((n) => n.toString(4).padStart(4, "0"))
        .join("")
        .split("")
        .map((x) => this.enc[parseInt(x)])
        .join("");
      return this.addVersion(unversioned);
    } catch (e) {
      return null;
    }
  }

  decodeUrl(ccc) {
    try {
      ccc = this.removeAndCheckVersion(ccc);
      if (!ccc) return null;

      let b4 = [];

      for (let ch of ccc) {
        if (!(ch in this.dec)) return null; // 防非法字符
        b4.push(this.dec[ch]);
      }

      let b4str = b4.join("");

      if (b4str.length % 4 !== 0) return null;

      let utf8arr = [];
      for (let i = 0; i < b4str.length; i += 4) {
        let num = parseInt(b4str.substring(i, i + 4), 4);
        if (isNaN(num)) return null;
        utf8arr.push(num);
      }

      return new TextDecoder().decode(new Uint8Array(utf8arr));
    } catch (e) {
      return null;
    }
  }

  toUTF8Array(str) {
    return new TextEncoder().encode(str);
  }
}

// 简单首页
const INDEX_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CCC Encoder</title>
</head>
<body>
<h2>CCC Encoder</h2>
<input id="url" placeholder="https://example.com" style="width:300px;">
<button onclick="gen()">生成</button>
<p id="out"></p>

<script>
function gen(){
  let url = document.getElementById('url').value;
  fetch('/encode?url='+encodeURIComponent(url))
    .then(r=>r.text())
    .then(t=>{
      let link = location.origin + '/' + t;
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
    try {
      const url = new URL(request.url);
      const ccc = new CCC();

      // 🔥 安全 decode（绝不抛异常）
      let rawPath = url.pathname.slice(1);
      let path = rawPath;

      try {
        path = decodeURIComponent(rawPath);
      } catch (e) {
        // 忽略错误，用原始值
      }

      // ✅ 首页
      if (!path) {
        return new Response(INDEX_HTML, {
          headers: { "content-type": "text/html;charset=utf-8" },
        });
      }

      // ✅ 编码接口
      if (url.pathname.startsWith("/encode")) {
        let target = url.searchParams.get("url");
        if (!target) {
          return new Response("missing url", { status: 400 });
        }

        let encoded = ccc.encodeUrl(target);
        if (!encoded) {
          return new Response("encode failed", { status: 500 });
        }

        return new Response(encoded);
      }

      // ✅ 解码
      let redirectUrl = ccc.decodeUrl(path);

      if (!redirectUrl) {
        return new Response("Invalid CCC URL", { status: 404 });
      }

      // 🔥 防止奇怪协议（安全）
      if (!/^https?:\/\//i.test(redirectUrl)) {
        redirectUrl = "https://" + redirectUrl;
      }

      return Response.redirect(redirectUrl, 302);

    } catch (err) {
      // 🚨 终极兜底（防1101）
      return new Response(
        "Worker Error (but handled safely)",
        { status: 500 }
      );
    }
  }
};