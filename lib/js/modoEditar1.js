//Botão span do fechar o modal do modo de edição(bola vermelha com x branco)

function fecharModal() {
    $('#editarPerguntaModal').addClass('oculto');
}

function abrirModal() {
    $('#editarPerguntaModal').removeClass('oculto');
    loadPergunta(0); // Exibe a primeira pergunta
}

//--------------------------------------------------------------------
//Funções para navegar entre as perguntas

let perguntaAtualIndex = 0;

function loadPergunta(index) {
    console.log('Exibindo pergunta com índice: ' + index);
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    console.log(perguntas);  // Verifica o array de perguntas no console
    if (index >= 0 && index < perguntas.length) {
        const pergunta = perguntas[index];
        $('#conteudoPergunta').html(`
            <p>Pergunta: ${pergunta.pergunta}</p>
            <p>Respostas:</p>
            <p>0. ${pergunta.respostas[0]}</p>
            <p>1. ${pergunta.respostas[1]}</p>
            <p>2. ${pergunta.respostas[2]}</p>
            <p>3. ${pergunta.respostas[3]}</p>
            <p>Correta: ${pergunta.correta}</p>
            <p>Dica: ${pergunta.dica}</p>
        `);
        perguntaAtualIndex = index;   // Atualiza o índice da pergunta atual
        console.log('Agora, perguntaAtualIndex recebe o valor', index)
    } else {
        $('#conteudoPergunta').html(`<p>Sem perguntas para exibir.</p>`);
    }
}


//---------------------------------------------------------------
//Novo método de navegação entre as perguntas
// Função para navegar para a pergunta anterior
function perguntaAnterior() {
    if (perguntaAtualIndex > 0) {
        loadPergunta(perguntaAtualIndex - 1);
    } else {
        alert('Você está na primeira pergunta.');
    }
}

// Função para navegar para a próxima pergunta
function perguntaProxima() {
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    if (perguntaAtualIndex < perguntas.length - 1) {
        loadPergunta(perguntaAtualIndex + 1);
    } else {
        alert('Você está na última pergunta.');
    }
}

// Eventos de clique nos botões de navegação
$('#anterior').click(perguntaAnterior);
$('#proxima').click(perguntaProxima);

// Eventos de teclado para navegação
$(document).keydown(function (e) {       //Captura qualquer tecla pressionada enquanto a página estiver em foco!
    switch (e.which) {                   //O método switch é usado para verificar o valor de uma variável ou expressão e executar diferentes ações com base nesses valores.Quando uma tecla é pressionada o valor e.which é capturado, então é feita uma verificação se é o case dentro do escopo do switch. Se sim, executa a ação pré-definida.
        case 37: // seta para a esquerda
            perguntaAnterior();
            break;

        case 39: // seta para a direita
            perguntaProxima();
            break;

        default: return; // ignora outras teclas
    }
    e.preventDefault(); // evita o comportamento padrão da tecla
});




//------------------------------------------------------------------
//Função para editar pergunta
$('#editQuestion').click(function () {
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    let pergunta = perguntas[perguntaAtualIndex];
    //console.log('Índice atual: ' + perguntaAtualIndex);
    $('#conteudoPergunta').html(`
        <input type="text" id="editPergunta" value="${pergunta.pergunta}">
        <input type="text" id="editResposta1" value="${pergunta.respostas[0]}">
        <input type="text" id="editResposta2" value="${pergunta.respostas[1]}">
        <input type="text" id="editResposta3" value="${pergunta.respostas[2]}">
        <input type="text" id="editResposta4" value="${pergunta.respostas[3]}">
        <input type="text" id="editCorreta" value="${pergunta.correta}">
        <input type="text" id="editDica" value="${pergunta.dica}">
    `);
    // Esconder os botões
    $('#anterior, #proxima, #editQuestion, #deleteQuestion').addClass('oculto');
    //Mostrar o botão saveChange
    $('#saveChanges').removeClass('oculto');
});

//-------------------------------------------------------------
// Função para resetar o modal ao fechar sem salvar
$('.close').click(function () {
    // Resetar o conteúdo da pergunta ao estado original
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    let pergunta = perguntas[perguntaAtualIndex];
    $('#conteudoPergunta').html(`
        <p>${pergunta.pergunta}</p>
        <ul>
            <li>${pergunta.respostas[0]}</li>
            <li>${pergunta.respostas[1]}</li>
            <li>${pergunta.respostas[2]}</li>
            <li>${pergunta.respostas[3]}</li>
        </ul>
        <p>Correta: ${pergunta.correta}</p>
        <p>Dica: ${pergunta.dica}</p>
    `);
    // Mostrar os botões ocultos
    $('#anterior, #proxima, #editQuestion, #deleteQuestion').removeClass('oculto');
    // Esconder o botão saveChange
    $('#saveChanges').addClass('oculto');
});
//-------------------------------------------------------------

//Evento de click no botão salvar
$('#saveChanges').click(function () {
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    perguntas[perguntaAtualIndex] = {
        pergunta: $('#editPergunta').val(),
        respostas: [
            $('#editResposta1').val(),
            $('#editResposta2').val(),
            $('#editResposta3').val(),
            $('#editResposta4').val()
        ],
        correta: $('#editCorreta').val(),
        dica: $('#editDica').val()
    };

    localStorage.setItem('perguntas', JSON.stringify(perguntas));
    loadPergunta(perguntaAtualIndex);
    console.log('Índice atual em saveChanges: ' + perguntaAtualIndex);
    $('#saveChanges').addClass('oculto');

    alert('Alterações salvas com sucesso!');
    // Mostrar os botões novamente após o alert
    $('#anterior, #proxima, #editQuestion, #deleteQuestion').removeClass('oculto');

    // Chamar a função para atualizar a interface do jogo
    atualizarInterfaceComNovasPerguntas();
});

//-----------------------------------------------------------------


// Função para Deletar Pergunta com alerta de confirmação
$('#deleteQuestion').click(function () {
    if (confirm('Deseja deletar esta pergunta?')) {
        let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
        perguntas.splice(perguntaAtualIndex, 1);

        localStorage.setItem('perguntas', JSON.stringify(perguntas));
        if (perguntaAtualIndex >= perguntas.length) {
            perguntaAtualIndex = perguntas.length - 1;
        }
        loadPergunta(perguntaAtualIndex);
        //console.log('Índice atual em deleteQuestion: ' + perguntaAtualIndex);
        alert('Pergunta deletada com sucesso!');
    }
});

//----------------------------------------------------------
