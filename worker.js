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

    return this.Utf8ArrayToStr(utf8arr);
  }

  toUTF8Array(str) {
    return new TextEncoder().encode(str);
  }

  Utf8ArrayToStr(array) {
    return new TextDecoder().decode(new Uint8Array(array));
  }
}

// ⭐⭐⭐ Worker 标准入口（关键改造）
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 🔥 decode URL（必须）
    let path = decodeURIComponent(url.pathname.slice(1));

    // ✅ 1. 首页
    if (!path) {
      return new Response(
        `<h1>CCC Worker Running ✅</h1>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    let redirectUrl = null;

    try {
      redirectUrl = new CCC().decodeUrl(path);
    } catch (e) {
      console.log("decode error:", e);
    }

    // ❌ 解码失败
    if (!redirectUrl) {
      return new Response("Invalid CCC URL", { status: 404 });
    }

    // 🔥 自动补协议
    if (!redirectUrl.startsWith("http")) {
      redirectUrl = "https://" + redirectUrl;
    }

    // ✅ 跳转
    return Response.redirect(redirectUrl, 302);
  }
};