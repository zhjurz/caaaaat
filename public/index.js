const input = document.getElementById("input-url");
const btn = document.getElementById("btn");
const result = document.getElementById("result");
const output = document.getElementById("output-url");
const copyBtn = document.getElementById("copy");

btn.onclick = generate;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generate();
});

function generate() {
  let val = input.value.trim();
  if (!val) return;

  if (!/^https?:\/\//i.test(val)) {
    val = "https://" + val;
  }

  try {
    new URL(val);
  } catch {
    alert("Invalid URL");
    return;
  }

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
