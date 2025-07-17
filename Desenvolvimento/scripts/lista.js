let listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];

document.addEventListener("DOMContentLoaded", () => {
  atualizarLista();
  document.getElementById("valorGasto").addEventListener("input", formatarValorGasto);
  configurarAnimacaoMenu(); // Ativa a animação do botão do menu
  carregarDadosDoUsuario(); // Carrega nome e foto do usuário no menu
  document.getElementById("metodoPagamento").addEventListener("change", function () {
  const campoParcelas = document.getElementById("campoParcelas");
  const campoMesParcela = document.getElementById("campoMesParcela");
  if (this.value === "credito") {
    campoParcelas.style.display = "block";
    campoMesParcela.style.display = "block";
  } else {
    campoParcelas.style.display = "none";
    campoMesParcela.style.display = "none";}});
});

function abrirPopupAdicionar() {
  document.getElementById("popupAdicionar").style.display = "flex";
  document.getElementById("nomeItem").value = "";
  document.getElementById("qtdItem").value = "";
  document.getElementById("kgItem").value = "";
  document.getElementById("campoQtd").style.display = "none";
  document.getElementById("campoKg").style.display = "none";
}

function mostrarCampoQtd() {
  document.getElementById("campoQtd").style.display = "block";
}

function mostrarCampoKg() {
  document.getElementById("campoKg").style.display = "block";
}

function fecharPopup(id) {
  document.getElementById(id).style.display = "none";
}

function adicionarItem(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeItem").value.trim();
  const qtd = document.getElementById("qtdItem").value;
  const kg = document.getElementById("kgItem").value;

  if (!nome) return;

  const item = {
    id: Date.now(),
    nome,
    qtd,
    kg,
    selecionado: false
  };

  listaItens.push(item);
  salvarLista();
  atualizarLista();
  fecharPopup("popupAdicionar");
}

function atualizarLista() {
  const ul = document.getElementById("listaItens");
  ul.innerHTML = "";

  listaItens.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" onchange="toggleItem(${item.id})" ${item.selecionado ? "checked" : ""}>
        ${item.nome}
        ${item.qtd ? ` - ${item.qtd} un` : ""}
        ${item.kg ? ` - ${item.kg} kg` : ""}
      </label>
    `;
    ul.appendChild(li);
  });
}

function toggleItem(id) {
  const item = listaItens.find(i => i.id === id);
  if (item) {
    item.selecionado = !item.selecionado;
    salvarLista();
  }
}

function abrirPopupPagamento() {
  const algumSelecionado = listaItens.some(i => i.selecionado);
  if (!algumSelecionado) return;

  document.getElementById("popupPagamento").style.display = "flex";
  document.getElementById("valorGasto").value = "";
  document.getElementById("metodoPagamento").value = "";
  document.getElementById("explicacaoPagamento").style.display = "none";
}

function mostrarExplicacao() {
  const box = document.getElementById("explicacaoPagamento");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

function formatarValorGasto(e) {
  // Remove tudo que não for número
  let valor = e.target.value.replace(/[^\d]/g, "");

  // Garante ao menos 3 dígitos (2 para centavos)
  if (valor.length < 3) valor = valor.padStart(3, "0");

  const centavos = valor.slice(-2);
  let inteiro = valor.slice(0, -2);

  // Remove zeros à esquerda do número inteiro
  inteiro = parseInt(inteiro).toString();

  // Formata milhar com ponto
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Atualiza valor do campo
  e.target.value = `${inteiro},${centavos}`;
}


function confirmarPagamento(event) {
  event.preventDefault();

  let valorInput = document.getElementById("valorGasto").value.trim();
  const metodo = document.getElementById("metodoPagamento").value;
  const parcelasInput = document.getElementById("parcelas");
  const mesParcelaInput = document.getElementById("mesParcelaInicial");

  // Validação do valor
  if (!valorInput) {
    mostrarPopup("Informe o valor gasto", "❌", true);
    return;
  }

  const valorConvertido = parseFloat(valorInput.replace(/\./g, '').replace(",", "."));
  if (isNaN(valorConvertido) || valorConvertido <= 0) {
    mostrarPopup("Valor inválido. Use o formato 10,00", "❌", true);
    return;
  }

  if (!metodo) {
    mostrarPopup("Escolha o método de pagamento", "❌", true);
    return;
  }

  const selecionados = listaItens.filter(i => i.selecionado);
  if (selecionados.length === 0) {
    mostrarPopup("Selecione pelo menos 1 item para pagar", "❌", true);
    return;
  }

  const agora = new Date();
  const idBase = Date.now();

  if (metodo === "credito") {
    const numParcelas = parseInt(parcelasInput.value);
    if (isNaN(numParcelas) || numParcelas <= 0) {
      mostrarPopup("Informe a quantidade de parcelas", "❌", true);
      return;
    }

    if (!mesParcelaInput.value) {
      mostrarPopup("Escolha o mês da primeira parcela", "❌", true);
      return;
    }

    const [anoBase, mesBase] = mesParcelaInput.value.split("-").map(Number);

    const creditos = JSON.parse(localStorage.getItem("itensCredito") || "[]");
    const valorParcela = parseFloat((valorConvertido / numParcelas).toFixed(2));

    const novos = [];

    selecionados.forEach(item => {
      for (let i = 0; i < numParcelas; i++) {
        const dataParcela = new Date();
        dataParcela.setFullYear(anoBase);
        dataParcela.setMonth(mesBase - 1 + i);
        novos.push({
          ...item,
          id: idBase + i + Math.random(),
          nome: item.nome + ` (Parcela ${i + 1}/${numParcelas})`,
          valorParcela,
          parcelas: numParcelas,
          valorTotal: valorConvertido,
          data: dataParcela.toISOString(),
          pago: false,
          tipo: "credito"
        });
      }
    });

    localStorage.setItem("itensCredito", JSON.stringify([...creditos, ...novos]));
    mostrarPopup("Pagamento registrado com sucesso!", "✔️");

  } else if (metodo === "fiado") {
    const fiados = JSON.parse(localStorage.getItem("itensFiado") || "[]");
    const novos = selecionados.map(item => {
      const dataFiado = new Date();
      dataFiado.setMonth(dataFiado.getMonth() + 1); // Mês seguinte

      return {
        ...item,
        id: idBase + Math.random(),
        valor: valorConvertido,
        data: dataFiado.toISOString(),
        pago: false,
        tipo: "fiado"
      };
    });

    localStorage.setItem("itensFiado", JSON.stringify([...fiados, ...novos]));
    mostrarPopup("Pagamento marcado como Pendente ⚠️", "⚠️");

  } else {
    const pagos = JSON.parse(localStorage.getItem("itensPago") || "[]");
    const novos = selecionados.map(item => ({
      ...item,
      id: idBase + Math.random(),
      valor: valorConvertido,
      data: agora.toISOString(),
      tipo: "debito"
    }));

    localStorage.setItem("itensPago", JSON.stringify([...pagos, ...novos]));
    mostrarPopup("Pagamento registrado com sucesso!", "✔️");
  }

  listaItens = listaItens.filter(i => !i.selecionado);
  salvarLista();
  atualizarLista();
  fecharPopup("popupPagamento");

  setTimeout(() => {
    document.getElementById("popupNotificacao")?.scrollIntoView({ behavior: "smooth" });
  }, 300);
}


function salvarLista() {
  localStorage.setItem("listaItens", JSON.stringify(listaItens));
}

function mostrarPopup(texto, icone = "✔️", erro = false) {
  const popup = document.getElementById("popupNotificacao");
  const textoSpan = document.getElementById("popupTexto");
  const iconeSpan = document.getElementById("popupIcone");

  textoSpan.textContent = texto;
  iconeSpan.textContent = icone;

  if (erro) {
    popup.style.backgroundColor = "#ffcc00";
    textoSpan.style.color = "#000"; // texto preto
  } else {
    popup.style.backgroundColor = "#4caf50";
    textoSpan.style.color = "#fff"; // texto branco
  }

  popup.style.display = "flex";

  setTimeout(() => {
    popup.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}



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
      botao.style.transform = "translate(150px,-10px)";
      botao.style.zIndex = "1101";
    } else {
      animacaoMenu.playSegments([frameSeta, frameMenu], true);
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
