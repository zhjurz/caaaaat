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

// ⭐ Worker 入口（重点优化版）
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 🔥 必须 decode（关键修复点）
  let path = decodeURIComponent(url.pathname.slice(1));

  // ✅ 首页放行
  if (!path) {
    return context.next();
  }

  let redirectUrl = null;

  try {
    redirectUrl = new CCC().decodeUrl(path);
  } catch (e) {
    console.log("decode error:", e);
  }

  // ❌ 解码失败 → 返回首页（避免 404）
  if (!redirectUrl) {
    return Response.redirect(url.origin, 302);
  }

  // 🔥 防止非法 URL（重要！）
  if (!redirectUrl.startsWith("http")) {
    redirectUrl = "https://" + redirectUrl;
  }

  // ✅ 跳转
  return Response.redirect(redirectUrl, 302);
}