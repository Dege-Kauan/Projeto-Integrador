document.addEventListener("DOMContentLoaded", () => {
  configurarAnimacaoMenu();
  carregarDadosPerfil();
  configurarLogout();
  configurarUploadFoto();
});

// === MENU LATERAL ===
function configurarAnimacaoMenu() {
  let menuAberto = false;
  const botao = document.getElementById('botaoLottieMenu');
  const menu = document.getElementById('menuLateral');

  const animacaoMenu = lottie.loadAnimation({
    container: botao,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'assets/icons-menu.json'
  });

  const frameMenu = 0;
  const frameSeta = 20;

  animacaoMenu.addEventListener('DOMLoaded', () => {
    animacaoMenu.goToAndStop(frameMenu, true);
  });

  botao.addEventListener('click', () => {
    menuAberto = !menuAberto;

    if (menuAberto) {
      animacaoMenu.playSegments([frameMenu, frameSeta], true);
      menu.classList.add("aberto");
      botao.style.transition = "transform 0.3s ease";
      botao.style.transform = "translate(150px, -10px)";
      botao.style.zIndex = "1101";
    } else {
      animacaoMenu.playSegments([frameSeta, frameMenu], true);
      menu.classList.remove("aberto");
      botao.style.transition = "transform 0.3s ease";
      botao.style.transform = "translateX(0)";
      botao.style.zIndex = "1000";
    }
  });
}

function carregarDadosPerfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Usuário não logado.");
    window.location.href = "login.html";
    return;
  }

  const nomeUsuarioMenu = document.getElementById("nomeUsuarioMenu");
  if (nomeUsuarioMenu) nomeUsuarioMenu.textContent = usuarioLogado.nome;

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    telefone: document.getElementById("telefone"),
    endereco: document.getElementById("endereco"),
    dataNascimento: document.getElementById("dataNascimento"),
  };

  fetch(`http://localhost:8080/api/usuarios/${usuarioLogado.id}`)
    .then(resp => resp.json())
    .then(usuario => {
      campos.nome.value = usuario.nome;
      campos.email.value = usuario.email;
      campos.telefone.value = usuario.telefone || "";
      campos.endereco.value = usuario.endereco || "";
      campos.dataNascimento.value = usuario.dataNascimento || "";
    });

  // ✅ FOTO DO LOCALSTORAGE
  const fotoSalva = usuarioLogado.foto;
  const fotoPreview = document.getElementById("fotoPreview");
  const removerBtn = document.getElementById("removerFoto");
  const containerFotoMenu = document.querySelector(".foto-usuario");

  if (fotoSalva && fotoSalva !== "assets/default-user.png") {
    fotoPreview.src = fotoSalva;
    if (removerBtn) removerBtn.style.display = "inline";

    if (containerFotoMenu) {
      containerFotoMenu.innerHTML = `<img src="${fotoSalva}" alt="Foto de Perfil" class="foto-menu-lateral" />`;
    }
  } else {
    fotoPreview.src = "assets/default-user.png";
    if (removerBtn) removerBtn.style.display = "none";
    if (containerFotoMenu) {
      containerFotoMenu.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      `;
    }
  }

  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      nome: campos.nome.value,
      email: campos.email.value,
      telefone: campos.telefone.value,
      endereco: campos.endereco.value,
      dataNascimento: campos.dataNascimento.value,
    };

    try {
      const resp = await fetch(`http://localhost:8080/api/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (resp.ok) {
        exibirPopup("Perfil atualizado com sucesso!", true);

        const novaFoto = document.getElementById("fotoPreview").src;

        const usuarioAtualizado = {
          ...usuarioLogado,
          ...dados,
          foto: novaFoto
        };

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
      } else {
        exibirPopup("Erro ao atualizar perfil.", false);
      }
    } catch (err) {
      console.error(err);
      exibirPopup("Erro ao conectar com o servidor.", false);
    }
  });
}

function configurarUploadFoto() {
  const input = document.getElementById("fotoUpload");
  const remover = document.getElementById("removerFoto");
  const preview = document.getElementById("fotoPreview");

  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64 = e.target.result;
      preview.src = base64;
      remover.style.display = "inline";

      // Atualiza menu lateral
      const containerFotoMenu = document.querySelector(".foto-usuario");
      if (containerFotoMenu) {
        containerFotoMenu.innerHTML = `<img src="${base64}" alt="Foto de Perfil" class="foto-menu-lateral" />`;
      }

      // Salva no localStorage
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado"));
      const atualizado = { ...usuarioLogado, foto: base64 };
      localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
      sessionStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
    };
    reader.readAsDataURL(file);
  });

  remover.addEventListener("click", () => {
    preview.src = "assets/default-user.png";
    input.value = "";
    remover.style.display = "none";

    const containerFotoMenu = document.querySelector(".foto-usuario");
    if (containerFotoMenu) {
      containerFotoMenu.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      `;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado"));
    const atualizado = { ...usuarioLogado, foto: "" };
    localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
    sessionStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
  });
}

function exibirPopup(texto, sucesso) {
  const popup = document.getElementById("popupNotificacao");
  const textoPopup = document.getElementById("popupTexto");
  const icone = document.getElementById("popupIcone");

  textoPopup.textContent = texto;
  icone.textContent = sucesso ? "✔️" : "❌";

  popup.classList.add("mostrar");
  popup.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => popup.classList.remove("mostrar"), 3000);
}

function configurarLogout() {
  window.logout = function () {
    localStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  };
}
