const input = document.getElementById("input-url");
const output = document.getElementById("output-url");
const cccBtn = document.getElementById("ccc-button");
const copyBtn = document.getElementById("copy-button");

input.addEventListener("keydown", (e) => (e.code == "Enter" ? cccat() : null));

let cccBtnInt;
cccBtn.addEventListener("mouseenter", () => {
  cccBtnInt = setInterval(() => {
    cccBtn.innerText =
      cccBtn.innerText == "cccccat！" ? "CcccCat！" : "cccccat！";
  }, 300);
});
cccBtn.addEventListener("mouseleave", () => {
  clearInterval(cccBtnInt);
  cccBtn.innerText = "cccccat！";
});

function cccat() {
  if (window.inBlinking) return;

  let inputVal = input.value.trim();

  // 自动补 http
  if (!/^https?:\/\//i.test(inputVal)) {
    inputVal = "https://" + inputVal;
  }

  try {
    new URL(inputVal);
  } catch (e) {
    // 原逻辑不变
    window.inBlinking = true;
    input.style.opacity = 1;
    input.disabled = true;
    let oldValue = input.value;
    input.value = "Invalid URL! Meowwwwww D:";
    let times = 0;
    let i = setInterval(() => {
      input.style.opacity = parseFloat(input.style.opacity) == 1 ? 0.2 : 1;
      if (++times == 6) {
        clearInterval(i);
        input.value = oldValue;
        input.disabled = false;
        input.focus();
        window.inBlinking = false;
      }
    }, 150);
    return;
  }

  const domain = location.host;
  let url = new CCC().encodeUrl(inputVal);

  url = `${location.protocol}//${domain}/${url}`;

  document.getElementById("output-div").style.display = "block";
  output.innerHTML = url;
  output.setAttribute("href", url);

  input.value = "";
}

function copy() {
  navigator.clipboard.writeText(output.innerHTML).then(() => {
    copyBtn.parentNode.setAttribute("data-showme", "");
    setTimeout(() => copyBtn.parentNode.removeAttribute("data-showme"), 1200);
  });
}
