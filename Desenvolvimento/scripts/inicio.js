let filtroSelecionado = "mes"; // "mes" ou "futuro"

document.addEventListener("DOMContentLoaded", () => {
  const usuario =
    JSON.parse(localStorage.getItem("usuarioLogado")) ||
    JSON.parse(sessionStorage.getItem("usuarioLogado"));

  const nomeCompleto = usuario?.nome || "Usuário";
  const primeiroNome = nomeCompleto.split(" ")[0];

  document.getElementById("nomeUsuarioMenu").textContent = primeiroNome;
  mostrarPopupBoasVindas(primeiroNome);
  configurarAnimacaoMenu();
  carregarDadosDoUsuario();

  // 🔁 Aplica eventos de clique aos cartões de filtro
  const filtroMes = document.getElementById("filtroMesAtual");
  const filtroFuturo = document.getElementById("filtroFuturo");

  filtroMes.addEventListener("click", () => {
    filtroSelecionado = "mes";
    atualizarResumo();
    aplicarEstiloSelecionado("mes");
  });

  filtroFuturo.addEventListener("click", () => {
    filtroSelecionado = "futuro";
    atualizarResumo();
    aplicarEstiloSelecionado("futuro");
  });

  // Atualiza pela primeira vez
  aplicarEstiloSelecionado("mes");
  atualizarResumo();
});



function logout() {
  localStorage.removeItem("usuarioLogado");
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

function mostrarPopupBoasVindas(nome) {
  const existente = document.querySelector(".popup-boas-vindas");
  if (existente) existente.remove();

  const popup = document.createElement("div");
  popup.classList.add("popup-boas-vindas");
  popup.textContent = `Olá, ${nome} 👋`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

function configurarAnimacaoMenu() {
  let menuAberto = false;
  const botao = document.getElementById("botaoLottieMenu");
  const menu = document.getElementById("menuLateral");

  const animacaoMenu = lottie.loadAnimation({
    container: botao,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "assets/icons-menu.json"
  });

  animacaoMenu.addEventListener("DOMLoaded", () => {
    animacaoMenu.goToAndStop(0, true);
  });

  botao.addEventListener("click", () => {
    menuAberto = !menuAberto;

    if (menuAberto) {
      animacaoMenu.playSegments([0, 20], true);
      menu.classList.add("aberto");
      botao.style.transform = "translate(150px,-10px)";
      botao.style.zIndex = "1101";
    } else {
      animacaoMenu.playSegments([20, 0], true);
      menu.classList.remove("aberto");
      botao.style.transform = "translateX(0)";
      botao.style.zIndex = "1000";
    }
  });
}

function carregarDadosDoUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
  
  // Atualiza nome
  if (usuario.nome) {
    const spanNome = document.getElementById("nomeUsuarioMenu");
    if (spanNome) spanNome.textContent = usuario.nome.split(" ")[0];
  }

  // Atualiza foto no menu lateral
  const containerFotoMenu = document.querySelector(".foto-usuario");

  if (containerFotoMenu) {
    if (usuario.foto && usuario.foto !== "" && usuario.foto !== "assets/default-user.png") {
      containerFotoMenu.innerHTML = `<img src="${usuario.foto}" alt="Foto de Perfil" class="foto-menu-lateral" />`;
    } else {
      containerFotoMenu.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      `;
    }
  }
}


function aplicarEstiloSelecionado(tipo) {
  const filtroMes = document.getElementById("filtroMesAtual");
  const filtroFuturo = document.getElementById("filtroFuturo");

  if (tipo === "mes") {
    filtroMes.classList.add("selecionado");
    filtroFuturo.classList.remove("selecionado");
  } else {
    filtroMes.classList.remove("selecionado");
    filtroFuturo.classList.add("selecionado");
  }
}


function destacarFiltro(idSelecionado) {
  document.querySelectorAll(".resumo-card").forEach(card =>
    card.classList.remove("selecionado")
  );
  document.getElementById(idSelecionado).classList.add("selecionado");
}

function atualizarResumo() {
  const pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");
  const creditos = JSON.parse(localStorage.getItem("itensCredito") || "[]");
  const fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  let totalDebito = 0, totalCredito = 0, totalFiado = 0;
  let totalGastoMes = 0;
  let totalFuturo = 0;

  const somarGasto = (item, tipo) => {
    const data = new Date(item.data);
    const mes = data.getMonth();
    const ano = data.getFullYear();

    let valor = 0;

    if (tipo === "credito") {
      const total = item.valorTotal || 0;
      const parcelas = item.parcelas || 1;
      valor = total / parcelas;
    } else {
      valor = item.valor || 0;
    }

    const isMesAtual = ano === anoAtual && mes === mesAtual;
    const isFuturo = ano > anoAtual || (ano === anoAtual && mes > mesAtual);

    // Contador dos totais principais (independente do filtro)
    if (isMesAtual) totalGastoMes += valor;
    else if (isFuturo) totalFuturo += valor;

    // Aplicar filtro nos cartões inferiores
    const incluir =
      (filtroSelecionado === "mes" && isMesAtual) ||
      (filtroSelecionado === "futuro" && isFuturo);

    if (incluir) {
      if (tipo === "debito") totalDebito += valor;
      if (tipo === "credito") totalCredito += valor;
      if (tipo === "fiado") totalFiado += valor;
    }
  };

  pagos.forEach(item => somarGasto(item, "debito"));
  creditos.forEach(item => somarGasto(item, "credito"));
  fiados.forEach(item => somarGasto(item, "fiado"));

  // Totais superiores
  document.getElementById("valorGasto").textContent = `R$ ${totalGastoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("valorFuturo").textContent = `R$ ${totalFuturo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Totais por tipo filtrados
  document.getElementById("resumoDebito").textContent = `R$ ${totalDebito.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("resumoCredito").textContent = `R$ ${totalCredito.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("resumoFiado").textContent = `R$ ${totalFiado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
