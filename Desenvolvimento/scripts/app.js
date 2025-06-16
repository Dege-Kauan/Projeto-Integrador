function abrirTela(tela) {
  const main = document.getElementById("conteudo-principal");
  if (tela === "lista") {
    main.innerHTML = gerarHTMLListaCompras();
  } else if (tela === "gastos") {
    main.innerHTML = gerarHTMLGastos();
  }
}

function gerarHTMLListaCompras() {
  return `
    <h2>Lista de Compras</h2>
    <form onsubmit="adicionarItem(event)">
      <input type="text" id="item" placeholder="Nome do item" required>
      <input type="number" id="valor" placeholder="Valor (R$)" step="0.01" required>
      <button type="submit">Adicionar</button>
    </form>
    <ul id="lista-compras"></ul>
  `;
}

function adicionarItem(event) {
  event.preventDefault();
  const nome = document.getElementById("item").value;
  const valor = parseFloat(document.getElementById("valor").value);

  const li = document.createElement("li");
  li.innerHTML = `${nome} - R$ ${valor.toFixed(2)} <button onclick="marcarComoPago(this, ${valor})">Marcar como pago</button>`;
  document.getElementById("lista-compras").appendChild(li);

  document.getElementById("item").value = '';
  document.getElementById("valor").value = '';
}

let totalPago = 0;

function marcarComoPago(button, valor) {
  button.parentElement.style.textDecoration = "line-through";
  button.remove();
  totalPago += valor;
}

function gerarHTMLGastos() {
  return `
    <h2>Controle de Gastos</h2>
    <p>Total pago: R$ ${totalPago.toFixed(2)}</p>
  `;
}