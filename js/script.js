/* ==========================================================
   FORNO & PIZZA — script.js
   - Carrinho de compras (guardado no localStorage)
   - Página "Monta a Tua Pizza": cálculo do preço e pré-visualização
   - Página "Encomendas": lista do carrinho, apagar e checkout
   - Página "Contactos": mensagem de envio
   ========================================================== */


/* ===== CARRINHO: FUNÇÕES BASE ===== */

// Nome com que o carrinho fica guardado no browser
const CHAVE = "fornoCarrinho";

// Lê o carrinho guardado (se não existir, devolve uma lista vazia)
function lerCarrinho() {
  return JSON.parse(localStorage.getItem(CHAVE)) || [];
}

// Guarda o carrinho e atualiza o número no cabeçalho
function guardarCarrinho(carrinho) {
  localStorage.setItem(CHAVE, JSON.stringify(carrinho));
  atualizarContador();
}

// Transforma 8.5 em "€8,50"
function formatarPreco(valor) {
  return "€" + valor.toFixed(2).replace(".", ",");
}

// Mostra no cabeçalho o total de artigos do carrinho
function atualizarContador() {
  const carrinho = lerCarrinho();
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].qtd;
  }
  document.querySelector(".carrinho span").textContent = total;
  document.querySelector(".carrinho").setAttribute("aria-label", "Carrinho, " + total + " artigos");
}

// Junta um artigo ao carrinho (se já existir, aumenta a quantidade)
function adicionarAoCarrinho(nome, preco) {
  const carrinho = lerCarrinho();
  let encontrado = false;

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      carrinho[i].qtd = carrinho[i].qtd + 1;
      encontrado = true;
    }
  }

  if (encontrado === false) {
    carrinho.push({ nome: nome, preco: preco, qtd: 1 });
  }

  guardarCarrinho(carrinho);
}

// Muda o texto de um botão durante 1,2 segundos (feedback ao utilizador)
function avisarNoBotao(botao, texto) {
  const original = botao.textContent;
  botao.textContent = texto;
  setTimeout(function () {
    botao.textContent = original;
  }, 1200);
}

// Em todas as páginas: mostra o número certo no cabeçalho
atualizarContador();


/* ===== PÁGINA MENU: BOTÕES "ADICIONAR" ===== */

const botoesAdicionar = document.querySelectorAll("[data-nome]");

for (let i = 0; i < botoesAdicionar.length; i++) {
  botoesAdicionar[i].addEventListener("click", function () {
    adicionarAoCarrinho(this.dataset.nome, parseFloat(this.dataset.preco));
    avisarNoBotao(this, "Adicionado");
  });
}


/* ===== PÁGINA MONTA A TUA PIZZA ===== */

// Lê as escolhas, calcula o preço e atualiza o resumo e a pizza
function calcular() {
  const massa = document.querySelector('input[name="massa"]:checked');
  const tamanho = document.querySelector('input[name="tamanho"]:checked');
  const ingredientes = document.querySelectorAll('input[type="checkbox"]');

  // Preço total = preço do tamanho + preço de cada ingrediente escolhido
  let total = parseFloat(tamanho.value);
  const escolhidos = [];

  for (let i = 0; i < ingredientes.length; i++) {
    const camada = document.getElementById("camada-" + ingredientes[i].name);

    // Mostra ou esconde o ingrediente na pizza
    camada.hidden = !ingredientes[i].checked;

    if (ingredientes[i].checked) {
      total = total + parseFloat(ingredientes[i].value);
      escolhidos.push(ingredientes[i].parentElement.textContent.trim());
    }
  }

  const nomeMassa = massa.parentElement.textContent.trim();
  const nomeTamanho = tamanho.parentElement.textContent.trim();
  const textoIngredientes = escolhidos.length > 0 ? escolhidos.join(", ") : "nenhum";

  // Resumo do pedido
  document.getElementById("resumo-massa").textContent = "Massa: " + nomeMassa;
  document.getElementById("resumo-tamanho").textContent = "Tamanho: " + nomeTamanho;
  document.getElementById("resumo-ingredientes").textContent = "Ingredientes: " + textoIngredientes;
  document.getElementById("total-monta").textContent = formatarPreco(total);

  // Pré-visualização: a pizza muda de tamanho e legenda
  document.getElementById("pizza-previa").style.width = tamanho.dataset.largura;
  document.getElementById("legenda-previa").textContent = nomeMassa + " · " + nomeTamanho;

  return { massa: nomeMassa, tamanho: nomeTamanho, ingredientes: textoIngredientes, total: total };
}

const formMonta = document.getElementById("form-monta");

if (formMonta) {

  // Sempre que o utilizador muda uma opção, recalcula
  formMonta.addEventListener("change", calcular);
  calcular();

  // Botão "Adicionar ao carrinho"
  formMonta.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const pizza = calcular();
    const nome = "Pizza personalizada (" + pizza.massa + ", " + pizza.tamanho + ", " + pizza.ingredientes + ")";
    adicionarAoCarrinho(nome, pizza.total);
    avisarNoBotao(document.getElementById("btn-add-monta"), "Adicionada");
  });
}


/* ===== PÁGINA ENCOMENDAS ===== */

// Desenha a lista do carrinho e o total
function mostrarCarrinho() {
  const carrinho = lerCarrinho();
  let total = 0;

  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<li><span>O carrinho está vazio.</span></li>";
  }

  for (let i = 0; i < carrinho.length; i++) {
    const subtotal = carrinho[i].preco * carrinho[i].qtd;
    total = total + subtotal;

    const linha = document.createElement("li");

    const descricao = document.createElement("span");
    descricao.textContent = carrinho[i].qtd + " × " + carrinho[i].nome;

    const preco = document.createElement("span");
    preco.className = "preco";
    preco.textContent = formatarPreco(subtotal) + " ";

    // Botão para apagar este artigo (guarda a posição na lista)
    const apagar = document.createElement("button");
    apagar.className = "btn-apagar";
    apagar.type = "button";
    apagar.textContent = "×";
    apagar.setAttribute("aria-label", "Remover " + carrinho[i].nome);
    apagar.dataset.indice = i;
    apagar.addEventListener("click", function () {
      const atual = lerCarrinho();
      atual.splice(Number(this.dataset.indice), 1);
      guardarCarrinho(atual);
      mostrarCarrinho();
    });

    preco.appendChild(apagar);
    linha.appendChild(descricao);
    linha.appendChild(preco);
    listaCarrinho.appendChild(linha);
  }

  document.getElementById("total-carrinho").textContent = formatarPreco(total);
}

const listaCarrinho = document.getElementById("lista-carrinho");

if (listaCarrinho) {

  mostrarCarrinho();

  // Checkout simulado: janela a rodar durante 3 segundos e depois confirmação
  const formEncomenda = document.getElementById("form-encomenda");

  formEncomenda.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const aviso = document.getElementById("aviso-carrinho");

    // Carrinho vazio: mostra aviso e pára
    if (lerCarrinho().length === 0) {
      aviso.hidden = false;
      return;
    }
    aviso.hidden = true;

    document.getElementById("modal").hidden = false;

    setTimeout(function () {
      document.getElementById("modal-a-processar").hidden = true;
      document.getElementById("modal-concluido").hidden = false;
      localStorage.removeItem(CHAVE);
      atualizarContador();
      mostrarCarrinho();
    }, 3000);
  });
}


/* ===== PÁGINA CONTACTOS ===== */

const formContacto = document.getElementById("form-contacto");

if (formContacto) {
  formContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    document.getElementById("mensagem-ok").hidden = false;
    formContacto.reset();
  });
}
