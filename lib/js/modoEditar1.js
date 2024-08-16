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





//-------------------------------------------------------------
//Funções para Navegar entre Perguntas

$('#anterior').click(function () {
    if (perguntaAtualIndex > 0) {
        loadPergunta(perguntaAtualIndex - 1);
    } else {
        alert('Você está na primeira pergunta.');
    }
});

//---------------------------------------------------------

$('#proxima').click(function () {
    console.log('Botão Próxima Pergunta clicado!');
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    console.log('Índice atual: ' + perguntaAtualIndex);  // Verifica o índice atual no console

    if (perguntaAtualIndex < perguntas.length - 1) {
        loadPergunta(perguntaAtualIndex + 1);
        console.log('Incremento realizado, novo índice: ' + (perguntaAtualIndex + 1));
    } else {
        alert('Você está na última pergunta.');
    }
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
