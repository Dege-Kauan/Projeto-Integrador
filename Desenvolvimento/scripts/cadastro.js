function cadastrarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById("nomeCompleto").value.trim();
  const email = document.getElementById("cadastroEmail").value.trim();
  const senha = document.getElementById("cadastroSenha").value;
  const confirmar = document.getElementById("confirmarSenha").value;
  const erroSenha = document.getElementById("erroSenha");

  erroSenha.textContent = "";

  if (senha.length < 6) {
    erroSenha.textContent = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (senha !== confirmar) {
    erroSenha.textContent = "As senhas não coincidem.";
    return;
  }

  const novoUsuario = {
    nome: nome,
    email: email,
    senha: senha,
    telefone: "",
    endereco: "",
    dataNascimento: "",
    fotoPerfil: null
  };

  fetch("http://localhost:8080/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoUsuario)
  })
    .then(response => {
      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        document.body.classList.remove("loaded");
        document.body.classList.add("slide-out-left");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 400);
      } else if (response.status === 400) {
        alert("E-mail já cadastrado ou dados inválidos.");
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    })
    .catch(error => {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    });
}

function toggleSenha(id, el) {
  const campo = document.getElementById(id);
  const aberto = campo.type === "text";
  campo.type = aberto ? "password" : "text";

  el.querySelector("svg").innerHTML = aberto
    ? `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    `
    : `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="2" y1="2" x2="22" y2="22" />
    `;
}
