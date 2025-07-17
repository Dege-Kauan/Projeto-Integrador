async function loginUsuario(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  const manterConectado = document.getElementById("manterConectado").checked;

  try {
    const resposta = await fetch("http://localhost:8080/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!resposta.ok) {
      alert("Usuário não encontrado ou senha incorreta.");
      return;
    }

    const usuario = await resposta.json();

    const sessao = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };

    if (manterConectado) {
      localStorage.setItem("usuarioLogado", JSON.stringify(sessao));
    } else {
      sessionStorage.setItem("usuarioLogado", JSON.stringify(sessao));
    }

    alert("Login realizado com sucesso!");

    document.body.classList.remove("loaded");
    document.body.classList.add("slide-out-left");
    setTimeout(() => {
      window.location.href = "inicio.html";
    }, 400);

  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    alert("Erro ao tentar logar. Verifique a conexão com o servidor.");
  }
}

function toggleSenha(idCampo, elementoIcone) {
  const campo = document.getElementById(idCampo);
  const svg = elementoIcone.querySelector("svg");

  if (campo.type === "password") {
    campo.type = "text";
    svg.innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  } else {
    campo.type = "password";
    svg.innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="2" y1="2" x2="22" y2="22" />
    `;
  }
}
