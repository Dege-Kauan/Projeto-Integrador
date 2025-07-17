document.addEventListener("DOMContentLoaded", () => {
  configurarAnimacaoMenu();
  carregarDadosDoUsuario();
  configurarFiltros();
  definirMesAtual();
  carregarGastos();
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

// === FILTROS ===
function configurarFiltros() {
  ["filtroTipo", "filtroDia", "filtroMes", "filtroAno"].forEach(id => {
    document.getElementById(id).addEventListener("change", carregarGastos);
  });
}

function definirMesAtual() {
  const hoje = new Date();
  document.getElementById("filtroMes").value = hoje.getMonth() + 1;
  document.getElementById("filtroAno").value = hoje.getFullYear();
}

// === GASTOS ===
function carregarGastos() {
  const tipo = document.getElementById("filtroTipo").value.toLowerCase();
  const dia = document.getElementById("filtroDia").value;
  const mes = document.getElementById("filtroMes").value;
  const ano = document.getElementById("filtroAno").value;

  const pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");
  const creditos = JSON.parse(localStorage.getItem("itensCredito") || "[]");
  const fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");

  let todos = [];

  todos = todos.concat(
    pagos.map(item => ({ ...item, tipo: "debito" })),
    creditos.map(item => ({ ...item, tipo: "credito" })),
    fiados.map(item => ({ ...item, tipo: "fiado" }))
  );

  if (tipo !== "") {
    todos = todos.filter(item => item.tipo === tipo);
  }

  if (dia || mes || ano) {
    todos = todos.filter(item => {
      const data = new Date(item.data);
      return (!dia || data.getDate() == dia) &&
             (!mes || (data.getMonth() + 1) == mes) &&
             (!ano || data.getFullYear() == ano);
    });
  }

  exibirGastos(todos);
}

function exibirGastos(lista) {
  const ul = document.getElementById("listaGastos");
  ul.innerHTML = "";

  let total = 0;

  if (lista.length === 0) {
    ul.innerHTML = "<li class='sem-gastos'>Nenhum gasto encontrado.</li>";
    return;
  }

  lista.forEach(item => {
    const li = document.createElement("li");

    const valor = item.valorParcela ?? item.valor ?? item.valorTotal;
total += valor;

const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR");
const tipoFormatado = item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1);

li.classList.add("gasto-item");

li.innerHTML = `
  <div class="resumo" onclick="toggleAcoes(this)">
    <div>
      <strong>${item.nome}</strong> - ${tipoFormatado}
      <div class="data">${dataFormatada}</div>
    </div>
    <span class="valor">R$ ${valor.toFixed(2).replace(".", ",")}</span>
  </div>

      <div class="acoes" style="display: none;">
        ${item.tipo === "fiado" ? `
          <button onclick="marcarComoPago(${item.id})">Marcar como Pago</button>
        ` : ""}
        <button onclick="excluirGasto('${item.tipo}', ${item.id})">Excluir</button>
      </div>
    `;

    ul.appendChild(li);
  });

  // Adiciona totalizador
  const totalLi = document.createElement("li");
  totalLi.classList.add("totalizador");
  totalLi.innerHTML = `<strong>Total:</strong> R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  ul.appendChild(totalLi);
}

function toggleAcoes(elementoResumo) {
  const acoes = elementoResumo.nextElementSibling;
  acoes.style.display = acoes.style.display === "none" ? "flex" : "none";
}

// === AÇÕES ===
function excluirGasto(tipo, id) {
  const chave = tipo.toLowerCase() === "debito" ? "itensPago"
              : tipo.toLowerCase() === "credito" ? "itensCredito"
              : "itensFiado";

  let dados = JSON.parse(localStorage.getItem(chave) || "[]");
  dados = dados.filter(item => item.id !== id);
  localStorage.setItem(chave, JSON.stringify(dados));
  carregarGastos();
}

function marcarComoPago(id) {
  let fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");
  let pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");

  const item = fiados.find(i => i.id === id);
  if (!item) return;

  fiados = fiados.filter(i => i.id !== id);

  item.tipo = "debito";
  item.data = new Date().toISOString();
  delete item.pago;

  pagos.push(item);

  localStorage.setItem("itensFiado", JSON.stringify(fiados));
  localStorage.setItem("itensPago", JSON.stringify(pagos));
  carregarGastos();
}
