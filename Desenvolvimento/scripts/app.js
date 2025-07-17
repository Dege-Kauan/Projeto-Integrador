document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    window.location.href = "login.html";
  }
});

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}
