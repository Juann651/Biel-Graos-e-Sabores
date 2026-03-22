// =======================
// BARRA DE PESQUISA
// =======================

const input = document.getElementById("pesquisa");
const produtos = document.querySelectorAll(".produto");
const resultado = document.getElementById("resultado");

input.addEventListener("input", () => {

    const valor = input.value.toLowerCase();
    let encontrados = 0;

    produtos.forEach(produto => {

        const nome = produto.querySelector("h2").innerText.toLowerCase();

        if(nome.includes(valor)){
            produto.style.display = "block";
            encontrados++;
        }else{
            produto.style.display = "none";
        }

    });

    resultado.textContent = encontrados + " produto(s) encontrado(s)";
});


// =======================
// CARRINHO (COM PERSISTÊNCIA)
// =======================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const listaCarrinho = document.getElementById("listaCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const contador = document.getElementById("contador");


// =======================
// ATUALIZAR CARRINHO
// =======================

function atualizarCarrinho(){

    listaCarrinho.innerHTML = "";

    let total = 0;

    carrinho.forEach((item,index) => {

        const div = document.createElement("div");

        div.innerHTML = `
        ${item.nome} <br>
        R$ ${item.preco.toFixed(2)} <br>
        <button class="menos" data-index="${index}">-</button>
        ${item.quantidade}
        <button class="mais" data-index="${index}">+</button>
        `;

        listaCarrinho.appendChild(div);

        total += item.preco * item.quantidade;

    });

    totalCarrinho.innerText = "Total: R$ " + total.toFixed(2);

    contador.innerText = carrinho.reduce((soma,item)=> soma + item.quantidade,0);

    ativarBotoesCarrinho();

    // SALVAR NO LOCALSTORAGE
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


// =======================
// BOTÕES + E - DO CARRINHO
// =======================

function ativarBotoesCarrinho(){

    document.querySelectorAll(".mais").forEach(botao=>{

        botao.addEventListener("click",()=>{

            const index = botao.dataset.index;

            carrinho[index].quantidade++;

            mostrarMensagem("Quantidade aumentada");

            atualizarCarrinho();

        });

    });

    document.querySelectorAll(".menos").forEach(botao=>{

        botao.addEventListener("click",()=>{

            const index = botao.dataset.index;

            carrinho[index].quantidade--;

            if(carrinho[index].quantidade <= 0){

                mostrarMensagem("Produto removido do carrinho");

                carrinho.splice(index,1);

            }else{

                mostrarMensagem("Quantidade diminuída");

            }

            atualizarCarrinho();

        });

    });

}


// =======================
// + E - NOS PRODUTOS
// =======================

const maisProdutos = document.querySelectorAll(".mais-produto");
const menosProdutos = document.querySelectorAll(".menos-produto");

maisProdutos.forEach(botao=>{

    botao.addEventListener("click",()=>{

        const produto = botao.closest(".produto");

        const nome = produto.querySelector("h2").innerText;
        const precoTexto = produto.querySelector(".preco").innerText;
        const qtdSpan = produto.querySelector(".qtd");

        const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));

        let item = carrinho.find(i => i.nome === nome);

        if(item){

            item.quantidade++;
            qtdSpan.innerText = item.quantidade;

            mostrarMensagem("Quantidade aumentada");

        }else{

            carrinho.push({
                nome,
                preco,
                quantidade:1
            });

            qtdSpan.innerText = 1;

            mostrarMensagem("Produto adicionado ao carrinho");
        }

        atualizarCarrinho();
    });

});


menosProdutos.forEach(botao=>{

    botao.addEventListener("click",()=>{

        const produto = botao.closest(".produto");

        const nome = produto.querySelector("h2").innerText;
        const qtdSpan = produto.querySelector(".qtd");

        let item = carrinho.find(i => i.nome === nome);

        if(!item) return;

        item.quantidade--;

        if(item.quantidade <= 0){

            carrinho = carrinho.filter(i => i.nome !== nome);

            qtdSpan.innerText = 0;

            mostrarMensagem("Produto removido do carrinho");

        }else{

            qtdSpan.innerText = item.quantidade;

            mostrarMensagem("Quantidade diminuída");
        }

        atualizarCarrinho();
    });

});


// =======================
// CARREGAR AO INICIAR
// =======================

if(carrinho.length > 0){

    atualizarCarrinho();

    carrinho.forEach(item => {

        document.querySelectorAll(".produto").forEach(produto => {

            const nome = produto.querySelector("h2").innerText;

            if(nome === item.nome){
                produto.querySelector(".qtd").innerText = item.quantidade;
            }

        });

    });

}


// =======================
// WHATSAPP FINALIZAR
// =======================

const finalizar = document.getElementById("finalizar");

finalizar.addEventListener("click", () => {

    if(carrinho.length === 0){
        alert("Seu carrinho está vazio");
        return;
    }

    let mensagem = "Olá, gostaria de fazer o pedido:%0A%0A";

    let total = 0;

    carrinho.forEach(item => {

        mensagem += `- ${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;

        total += item.preco * item.quantidade;

    });

    mensagem += `%0A Total: R$ ${total.toFixed(2)}`;

    const telefone = "5527998177162";

    const url = `https://wa.me/${telefone}?text=${mensagem}`;

    window.open(url, "_blank");

    // LIMPAR CARRINHO APÓS FINALIZAR
    carrinho = [];
    localStorage.removeItem("carrinho");
    atualizarCarrinho();
});


// =======================
// ABRIR / FECHAR CARRINHO
// =======================

const abrirCarrinho = document.getElementById("abrirCarrinho");
const carrinhoBox = document.getElementById("carrinhoBox");

abrirCarrinho.addEventListener("click", () => {
    carrinhoBox.classList.toggle("ativo");
});


// FECHAR CLICANDO FORA

document.addEventListener("click", (evento) => {

    const clicouFora = !carrinhoBox.contains(evento.target);
    const clicouIcone = abrirCarrinho.contains(evento.target);

    if (clicouFora && !clicouIcone) {
        carrinhoBox.classList.remove("ativo");
    }

});


// IMPEDIR FECHAR AO CLICAR DENTRO

carrinhoBox.addEventListener("click", (e)=>{
    e.stopPropagation();
});


// =======================
// TOAST MENSAGEM
// =======================

const toast = document.getElementById("toast");

function mostrarMensagem(texto){

    toast.textContent = texto;

    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    },2000);
}