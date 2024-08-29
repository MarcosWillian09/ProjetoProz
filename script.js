const produtos = [];

const inputNomeProduto = document.getElementById("productName");
const inputPrecoProduto = document.getElementById("productPrice");
const inputCategoria = document.getElementById("categoryInput");
const buttonCadastrar = document.getElementById("botaoCadastro");
const inputQuantidade = document.getElementById("qtdProduto");
const tabelaProdutos = document.getElementById("bodyTable");
const filtroCategoria = document.getElementById("seletorCategoria");

function adicionarProduto() {
  let nome = inputNomeProduto.value;
  let preco = inputPrecoProduto.value;
  let categoria = inputCategoria.value;
  let quantidade = inputQuantidade.value;

  if (nome && preco && categoria) {
    const novoProduto = {
      id: Date.now(),
      Nome: nome,
      Preço: preco,
      Categoria: categoria,
      Quantidade: quantidade,
    };

    const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];
    listaProdutosSalvos.push(novoProduto);

    localStorage.setItem("ListaProdutos", JSON.stringify(listaProdutosSalvos));

    produtos.push(novoProduto);
    mostrarProdutos();

    inputNomeProduto.value = "";
    inputPrecoProduto.value = "";
    inputQuantidade.value = "";
    inputCategoria.value = "";
    alert("Produto cadastrado com sucesso!");
    atualizarListaCategorias();
  } else {
    alert("Preencha todos os campos obrigatórios.");
  }
}

function mostrarProdutos(categoriaFiltro = "") {
  let linhasTabela = "";
  const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];

  listaProdutosSalvos.forEach((produto) => {
    if (!categoriaFiltro || produto.Categoria === categoriaFiltro) {
      linhasTabela += `<tr>
                         <td>${produto.Nome}</td>
                         <td>${"R$ " + produto.Preço}</td>
                         <td>${produto.Quantidade}</td>
                         <td>${produto.Categoria}</td>
                         <td class="FlexH AlinhadoArd">
                           <button class="FlexH AlinhadoCen" onclick="editarProduto(${produto.id})">Editar</button>
                           <button class="FlexH AlinhadoCen" onclick="removerProduto(${produto.id})">Remover</button>
                           <button class="FlexH AlinhadoCen" onclick="adicionarQuantidade(${produto.id})">Adicionar Itens</button>
                           <button class="FlexH AlinhadoCen" onclick="removerQuantidade(${produto.id})">Remover Itens</button>
                         </td>
                       </tr>`;
    }
  });

  tabelaProdutos.innerHTML = linhasTabela;
}

function removerProduto(id) {
  let listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];

  listaProdutosSalvos = listaProdutosSalvos.filter(produto => produto.id !== id);

  localStorage.setItem("ListaProdutos", JSON.stringify(listaProdutosSalvos));

  mostrarProdutos();
  atualizarListaCategorias();
}

function atualizarListaCategorias() {
  const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];
  const categoriasUnicas = [...new Set(listaProdutosSalvos.map(produto => produto.Categoria))];

  filtroCategoria.innerHTML = '<option value="">Todas</option>';

  categoriasUnicas.forEach(categoria => {
    const novaOpcao = document.createElement("option");
    novaOpcao.value = categoria;
    novaOpcao.textContent = categoria;
    filtroCategoria.appendChild(novaOpcao);
  });
}

function filtrarCategoria() {
  const categoriaSelecionada = filtroCategoria.value;
  mostrarProdutos(categoriaSelecionada);
}

function editarProduto(id) {
  const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];
  const produto = listaProdutosSalvos.find(p => p.id === id);

  if (produto) {
    const novoNome = prompt("Novo Nome do Produto:", produto.Nome);
    const novoPreco = prompt("Novo Preço do Produto:", produto.Preço);
    const novaCategoria = prompt("Nova Categoria do Produto:", produto.Categoria);
    const novaQuantidade = prompt("Nova quantidade de produtos:", produto.Quantidade);

    if (novoNome && novoPreco && novaCategoria && novaQuantidade) {
      const produtoAtualizado = {
        id: produto.id,
        Nome: novoNome,
        Preço: novoPreco,
        Categoria: novaCategoria,
        Quantidade: novaQuantidade 
      };

      const produtosAtualizados = listaProdutosSalvos.map(p => p.id === id ? produtoAtualizado : p);
      localStorage.setItem("ListaProdutos", JSON.stringify(produtosAtualizados));

      mostrarProdutos();
      atualizarListaCategorias();
    } else {
      alert("Todos os campos são obrigatórios para a edição.");
    }
  }
}

function adicionarQuantidade(id) {
  const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];
  const produto = listaProdutosSalvos.find(p => p.id === id);
  
  if (produto) {
    const quantidadeAdicional = parseInt(prompt(`Quantos itens de ${produto.Nome} você deseja adicionar?`), 10);
    
    if (!isNaN(quantidadeAdicional) && quantidadeAdicional > 0) {
      produto.Quantidade = (parseInt(produto.Quantidade, 10) || 0) + quantidadeAdicional;
      
      const produtosAtualizados = listaProdutosSalvos.map(p => p.id === id ? produto : p);
      localStorage.setItem("ListaProdutos", JSON.stringify(produtosAtualizados));
      
      mostrarProdutos();
      atualizarListaCategorias();
    } else {
      alert("Quantidade inválida.");
    }
  } else {
    alert("Produto não encontrado.");
  }
}

function removerQuantidade(id) {
  const listaProdutosSalvos = JSON.parse(localStorage.getItem("ListaProdutos")) || [];
  const produto = listaProdutosSalvos.find(p => p.id === id);
  
  if (produto) {
    const quantidadeRemover = parseInt(prompt(`Quantos itens de ${produto.Nome} você deseja remover?`), 10);
    
    if (!isNaN(quantidadeRemover) && quantidadeRemover > 0) {
      if (produto.Quantidade - quantidadeRemover < 0) {
        alert("Quantidade a ser removida é maior que a quantidade disponível.");
      } else {
        produto.Quantidade = (parseInt(produto.Quantidade, 10) || 0) - quantidadeRemover;
        
        const produtosAtualizados = listaProdutosSalvos.map(p => p.id === id ? produto : p);
        localStorage.setItem("ListaProdutos", JSON.stringify(produtosAtualizados));
        
        mostrarProdutos();
        atualizarListaCategorias();
      }
    } else {
      alert("Quantidade inválida.");
    }
  } else {
    alert("Produto não encontrado.");
  }
}

buttonCadastrar.addEventListener("click", function (e) {
  e.preventDefault();
  adicionarProduto();
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarProdutos();
  atualizarListaCategorias();
});