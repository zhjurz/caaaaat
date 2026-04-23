const input = document.getElementById("input-url");
const btn = document.getElementById("btn");
const result = document.getElementById("result");
const output = document.getElementById("output-url");
const copyBtn = document.getElementById("copy");
const btnText = btn.querySelector(".btn-text");
const btnKaomoji = btn.querySelector(".btn-kaomoji");

const kaomojiList = [
  "(｀･ω･´)",
  "(≧∇≦)ﾉ",
  "(｀Д´)ﾉ",
  "(ง •̀_•́)ง",
  "(｡•ˇ‸ˇ•｡)",
  "(¬_¬)ﾉ",
];

let isAngry = false;

btn.onclick = generate;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generate();
});

input.addEventListener("input", () => {
  if (isAngry) resetBtn();
});

function setAngry() {
  isAngry = true;
  btn.classList.add("angry");
  btnText.textContent = "Meow！";
  btnKaomoji.textContent =
    kaomojiList[Math.floor(Math.random() * kaomojiList.length)];
  btnKaomoji.classList.remove("hidden");
}

function resetBtn() {
  isAngry = false;
  btn.classList.remove("angry");
  btnText.textContent = "Cccccat";
  btnKaomoji.classList.add("hidden");
}

function generate() {
  let val = input.value.trim();
  if (!val) return;

  if (!/^https?:\/\//i.test(val)) {
    val = "https://" + val;
  }

  try {
    new URL(val);
  } catch {
    setAngry();
    return;
  }

  if (isAngry) resetBtn();

  const ccc = new CCC();
  const encoded = ccc.encodeUrl(val);

  const finalUrl = location.origin + "/" + encoded;

  output.textContent = finalUrl;
  output.href = finalUrl;

  result.classList.remove("hidden");
}

copyBtn.onclick = () => {
  navigator.clipboard.writeText(output.textContent);
};
