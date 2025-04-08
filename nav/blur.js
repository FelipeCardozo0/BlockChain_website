let timeout;
const overlay = document.getElementById("overlay");

function triggerBlur() {
  document.body.classList.add("blur-active");
  overlay.classList.add("active");
}

function resetTimer() {
  clearTimeout(timeout);
  document.body.classList.remove("blur-active");
  overlay.classList.remove("active");
  timeout = setTimeout(triggerBlur, 5000); // 5s
}

['mousemove', 'scroll', 'keydown'].forEach(event =>
  window.addEventListener(event, resetTimer)
);

resetTimer();
