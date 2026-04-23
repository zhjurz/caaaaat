class CCC {
  constructor() {
    this.enc = ["c", "C", "с", "ϲ"];
    this.dec = { c: "0", C: "1", с: "2", ϲ: "3" };
    this.ver = "cccc";
  }

  encodeUrl(url) {
    let bytes = new TextEncoder().encode(url);
    let b4 = Array.from(bytes)
      .map((n) => n.toString(4).padStart(4, "0"))
      .join("");

    let out = "";
    for (let ch of b4) out += this.enc[parseInt(ch)];

    return this.ver + out;
  }
}
