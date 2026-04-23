class CCC {
  constructor() {
    this.enc = ["c", "C", "с", "ϲ"];
    this.dec = {
      c: "0",
      C: "1",
      с: "2",
      ϲ: "3",
    };
    this.ver = "cccc";
  }

  encodeUrl(url) {
    try {
      let bytes = new TextEncoder().encode(url);

      let b4 = Array.from(bytes)
        .map((n) => n.toString(4).padStart(4, "0"))
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