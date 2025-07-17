document.addEventListener("DOMContentLoaded", () => {
  configurarAnimacaoMenu();
  carregarDadosDoUsuario();
  gerarGraficoTipoPagamento();
  gerarGraficoGastosMensais();
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

function gerarGraficoTipoPagamento() {
  const inicio = document.getElementById("dataInicioTipo").value;
  const fim = document.getElementById("dataFimTipo").value;

  const pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");
  const creditos = JSON.parse(localStorage.getItem("itensCredito") || "[]");
  const fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");

  function filtrarPorData(item) {
    const data = new Date(item.data);
    if (inicio && data < new Date(inicio)) return false;
    if (fim && data > new Date(fim)) return false;
    return true;
  }

  const debitoFiltrado = pagos.filter(filtrarPorData);
  const creditoFiltrado = creditos.filter(filtrarPorData);
  const fiadoFiltrado = fiados.filter(filtrarPorData);

  const totalDebito = debitoFiltrado.reduce((acc, i) => acc + i.valor, 0);
  const totalCredito = creditoFiltrado.reduce((acc, i) => acc + i.valorTotal, 0);
  const totalFiado = fiadoFiltrado.reduce((acc, i) => acc + i.valor, 0);

  const ctx = document.getElementById("graficoTipo").getContext("2d");
  if (window.graficoTipoObj) window.graficoTipoObj.destroy();

  window.graficoTipoObj = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Débito", "Crédito", "Fiado"],
      datasets: [{
        data: [totalDebito, totalCredito, totalFiado],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"]
      }]
    },
options: {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom"
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const valor = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const porcentagem = ((valor / total) * 100).toFixed(1);
          return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (${porcentagem}%)`;
        }
      }
    }
  }
}
  });
}

function gerarGraficoGastosMensais() {
  const inicio = document.getElementById("dataInicioMes").value;
  const fim = document.getElementById("dataFimMes").value;

  const pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");
  const creditos = JSON.parse(localStorage.getItem("itensCredito") || "[]");
  const fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");

  const gastosPorMes = {};

  function adicionarGasto(item, valor) {
    const data = new Date(item.data);
    if (inicio && data < new Date(inicio)) return;
    if (fim && data > new Date(fim)) return;

    const chave = `${data.getMonth() + 1}/${data.getFullYear()}`;
    gastosPorMes[chave] = (gastosPorMes[chave] || 0) + valor;
  }

  pagos.forEach(item => adicionarGasto(item, item.valor));
  creditos.forEach(item => adicionarGasto(item, item.valorTotal));
  fiados.forEach(item => adicionarGasto(item, item.valor));

  const meses = Object.keys(gastosPorMes).sort((a, b) => {
    const [m1, y1] = a.split("/").map(Number);
    const [m2, y2] = b.split("/").map(Number);
    return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
  });

  const valores = meses.map(m => gastosPorMes[m]);

  const ctx = document.getElementById("graficoMes").getContext("2d");
  if (window.graficoMesObj) window.graficoMesObj.destroy();

  window.graficoMesObj = new Chart(ctx, {
  type: "bar",
  data: {
    labels: meses,
    datasets: [{
      label: "Gastos por mês (R$)",
      data: valores,
      backgroundColor: "#673ab7"
    }]
  },
options: {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const valor = context.parsed.y;
          const index = context.dataIndex;
          const anterior = index > 0 ? context.chart.data.datasets[0].data[index - 1] : null;
          let diferenca = "";
          
          if (anterior !== null && anterior > 0) {
            const percentual = (((valor - anterior) / anterior) * 100).toFixed(1);
            const cor = valor > anterior ? "🔺" : valor < anterior ? "🔻" : "";
            diferenca = ` (${cor} ${percentual}%)`;
          }

          return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}${diferenca}`;
        }
      }
    },
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}`;
        }
      }
    }
  }
}
});
}