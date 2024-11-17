function salvarPergunta() {
    // Use jQuery para selecionar os elementos do formulário
    const pergunta = $('#novaPergunta').val();
    const respostas = [
        $('#resposta1').val(),
        $('#resposta2').val(),
        $('#resposta3').val(),
        $('#resposta4').val()
    ];

    const corretaInput = $('#correta').val();
    const corretaIndex = parseInt(corretaInput);
    const correta = `resp${corretaIndex}`; // Usa diretamente o índice fornecido pelo usuário

    //console.log(correta);


    const dica = $('#dica').val();



    //-----------------------------------------------------------------
    // Verifique se algum campo está vazio
    if (!pergunta) {
        alert('O campo "Pergunta" não pode estar vazio.');
        $('#novaPergunta').focus();
        return;
    }


    for (let i = 0; i < respostas.length; i++) {
        if (!respostas[i]) {
            alert(`O campo "Resposta ${i + 1}" não pode estar vazio.`);
            $(`#resposta${i + 1}`).focus();
            return;
        }
    }

    if (isNaN(corretaIndex) || corretaIndex < 0 || corretaIndex > 3) {
        alert('O campo "Correta" deve ser um número entre 0 e 3.');
        $('#correta').focus();
        return;
    }



    if (!dica) {
        alert('O campo "Dica" não pode estar vazio.');
        $('#dica').focus();
        return;
    }

    //---------------------------------------------------------------

    const novaPergunta = {
        pergunta,
        respostas,
        correta,
        dica
    };


    // Recupere o array de perguntas do localStorage (ou crie um novo)
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];
    perguntas.push(novaPergunta);

    // Salve o array atualizado no localStorage
    localStorage.setItem('perguntas', JSON.stringify(perguntas));

    // Limpe os campos do formulário
    $('#novaPerguntaForm')[0].reset();

    //Mantêm o foco no campo input id #novaPergunta
    $('#novaPergunta').focus();

    // Exiba uma mensagem de sucesso
    alert('Pergunta salva com sucesso!');

    atualizarInterfaceComNovasPerguntas();
}

