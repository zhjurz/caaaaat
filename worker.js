class CCC {
  enc = ["c", "C", "с", "ϲ"];
  dec = {
    c: "0",
    C: "1",
    с: "2",
    ϲ: "3",
  };
  ver = "cccc";

  encodeUrl(url) {
    try {
      let bytes = new TextEncoder().encode(url);
      let b4 = Array.from(bytes)
        .map(n => n.toString(4).padStart(4, "0"))
        .join("");

      let out = "";
      for (let ch of b4) {
        out += this.enc[parseInt(ch)];
      }

      return this.ver + out;
    } catch {
      return null;
    }
  }

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

// 🔥 前端页面（和 Worker 共用同一套 CCC）
const HTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CCC Encoder</title>
<style>
body{font-family:sans-serif;text-align:center;margin-top:80px}
input{width:320px;padding:8px}
button{padding:8px 16px}
a{word-break:break-all}
</style>
</head>
<body>
<h2>CCC URL Encoder</h2>

<input id="url" placeholder="https://example.com">
<button onclick="gen()">生成</button>

<p id="out"></p>

<script>
class CCC {
  constructor(){
    this.enc=["c","C","с","ϲ"];
    this.dec={"c":"0","C":"1","с":"2","ϲ":"3"};
    this.ver="cccc";
  }

  encodeUrl(url){
    let bytes = new TextEncoder().encode(url);
    let b4 = Array.from(bytes)
      .map(n => n.toString(4).padStart(4,"0"))
      .join("");

    let out="";
    for(let ch of b4){
      out += this.enc[parseInt(ch)];
    }
    return this.ver + out;
  }
}

function gen(){
  let input = document.getElementById("url").value.trim();
  if(!input) return;

  let ccc = new CCC();
  let encoded = ccc.encodeUrl(input);

  let link = location.origin + "/" + encoded;

  document.getElementById("out").innerHTML =
    '<a href="'+link+'" target="_blank">'+link+'</a>';
}
</script>
</body>
</html>
`;

function safeDecode(path){
  try{
    let once = decodeURIComponent(path);
    try{
      return decodeURIComponent(once);
    }catch{
      return once;
    }
  }catch{
    return path;
  }
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const ccc = new CCC();

      let path = safeDecode(url.pathname.slice(1));

      // ✅ 首页
      if (!path) {
        return new Response(HTML, {
          headers: { "content-type": "text/html;charset=utf-8" },
        });
      }

      // ✅ 解码跳转
      let target = ccc.decodeUrl(path);

      if (!target) {
        return new Response("Invalid CCC URL", { status: 404 });
      }

      if (!/^https?:\/\//i.test(target)) {
        target = "https://" + target;
      }

      return Response.redirect(target, 302);

    } catch (e) {
      return new Response("Internal Error", { status: 500 });
    }
  }
};