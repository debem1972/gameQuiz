// Defina a variável perguntas globalmente
let perguntas = [];

//------------------------------------------------------------

//Evento de click em qualquer botão gera som
$(document).ready(function () {
    let clickButton = new Audio('sound/clique2.mp3');

    //Adiciona o evento de click em todas as tag button
    $('button').click(function () {
        clickButton.play();
    })
});

//-----------------------------------------------------------------
// Função para resetar o conteúdo e o data-indice do h2 #pergunta
function resetarPergunta() {
    $('#pergunta').html('');
    $('#pergunta').removeAttr('data-indice');
    $('#resp0').html('');
    $('#resp1').html('');
    $('#resp2').html('');
    $('#resp3').html('');

}


//----------------------------------------------------------------------------------
// Função para exibir a mensagem de boas-vindas
function exibirMensagemBoasVindas(nomeJogador) {
    let mensagem = `Bem-vindo ${nomeJogador}!!! Tenha um bom jogo!`;
    let welcomeMessageElement = $('#welcomeMessage');
    welcomeMessageElement.html(mensagem);
    welcomeMessageElement.removeClass('oculto');

    let totalPerguntas = perguntas.length;

    // Ocultar a mensagem após 3 segundos
    setTimeout(function () {
        welcomeMessageElement.addClass('oculto');

        // Iniciar cronômetro após ocultar a mensagem de boas-vindas
        iniciarCronometro();

        // Chamar a função para gerar a pergunta      
        gerarPergunta(totalPerguntas);

    }, 3000);
}
//------------------------------------------------------------------
// Função para carregar perguntas do localStorage
function carregarPerguntasDoLocalStorage() {
    // Obtenha a string JSON do localStorage
    let perguntasJSON = localStorage.getItem('perguntas');

    // Verifique se há dados no localStorage
    if (perguntasJSON) {
        // Converta a string JSON de volta para um array de objetos
        perguntas = JSON.parse(perguntasJSON);
    }
}
//------------------------------------------------------------------
//Estrutura do cronometro

let reiniciarCronometro = true;   //Variável para controlar se o cronômetro deve ser reiniciado

// Objeto de áudio ticTac
let audioTicTac = new Audio('sound/ticTac.mp3');

// Objeto de áudio fim de tempo
let audioFinalTime = new Audio('sound/fimDeTempo.mp3');

// Funções do cronômetro
let cronometroInterval;
let tempoRestante = 15 * 1000;

//------------------------------------------------
//Flag global para testar a parada do cronômetro
let cronometroParado = false;
//----------------------------------------------------
//Flag global para testar a pausa do cronômetro
let cronometroPausado = false;
//Armazena o tempo restante quando o cronômetro foi pausado.
let tempoPausado;
//----------------------------------------------------

function iniciarCronometro() {
    reiniciarCronometro = true; // Define a variável como true para reiniciar o cronômetro

    let totalPerguntas = perguntas.length;

    clearInterval(cronometroInterval); // Garantir que qualquer cronômetro anterior seja limpo

    let startTime;
    let endTime;

    tempoRestante = 15 * 1000;
    atualizarDisplay(tempoRestante);

    // Verificar se o cronômetro foi pausado antes de reiniciá-lo
    if (!cronometroParado) {
        startTime = Date.now();
        endTime = startTime + tempoRestante;
    } else {
        // Se o cronômetro foi pausado, retomar o tempo a partir do tempo pausado
        startTime = Date.now();
        endTime = startTime + tempoRestante;
    }


    // Iniciar o áudio
    audioTicTac.loop = true; // Faz o áudio repetir continuamente
    audioTicTac.play();



    cronometroInterval = setInterval(function () {
        let now = Date.now();
        tempoRestante = endTime - now;


        if (tempoRestante <= 0) {
            tempoRestante = 0;
            clearInterval(cronometroInterval);

            audioTicTac.pause(); // Parar o áudio quando o cronômetro zera
            audioTicTac.currentTime = 0; // Reiniciar o áudio para o início
            audioFinalTime.play();

            // Exibir mensagem de fim de tempo

            if ($('.resposta.selecionada').length === 0 || !confirmado) {
                gameOver();
            }
            // Verifica se nenhuma resposta foi selecionada e se ainda há perguntas a serem feitas
            if ($('.resposta.selecionada').length === 0 && perguntasFeitas.length < totalPerguntas) {
                gameOver(); // Chama a função gameOver() se o tempo acabou e ainda há perguntas a serem feitas
            } else {
                pararCronometro(); // Caso contrário, apenas para o cronômetro

            }

        }


        atualizarDisplay(tempoRestante);
    }, 10);    // Atualização a cada 10 milissegundos
}



function atualizarDisplay(tempo) {
    let seconds = Math.floor((tempo / 1000) % 60);
    let milliseconds = Math.floor((tempo % 1000) / 10);
    $('#cronos').html(`00:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`);
}

function resetarCronometro() {
    if (reiniciarCronometro) {
        clearInterval(cronometroInterval);
        cronometroParado = false;
        cronometroPausado = false;
        tempoRestante = 15 * 1000;
        iniciarCronometro();
    }

};

//-----------------------------------------------------
// Função para parar o cronômetro
function pararCronometro() {
    reiniciarCronometro = false; // Define a variável como false para parar o cronômetro
    clearInterval(cronometroInterval);  // Para o cronômetro

    // Parar o áudio
    if (audioTicTac) {
        audioTicTac.pause();
        audioTicTac.currentTime = 0; // Reiniciar o áudio para o início
        console.log('Áudio tic-tac pausado e reiniciado.');

    } else {
        console.log('Áudio tic-tac não está definido.');
    }
    cronometroParado = true; // Define a flag como verdadeira
    console.log('Cronômetro parado com sucesso.'); // Log de verificação

    //Armazenar o tempo restante quando o cronômetro foi pausado
    if (tempoRestante > 0) {
        tempoPausado = tempoRestante;
    }

};

//------------------------------------------------------
function resetarParaZero() {
    //pararCronometro(); // Para o cronômetro primeiro
    setTimeout(function () {
        tempoRestante = 0; // Reseta o valor do cronômetro para 0
        atualizarDisplay(tempoRestante); // Atualiza o display do cronômetro; // Atualiza o display do cronômetro
    }, 500);
}



//------------------------------------------------------------------

// Função para atualizar a interface do jogo com as perguntas do localStorage
function atualizarInterfaceComNovasPerguntas() {
    // Obtém o array de perguntas do localStorage
    var perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];

    // Verifica se existem perguntas armazenadas
    if (perguntas.length > 0) {
        /* Aqui é implementada a lógica para atualizar a interface do jogo
        com as novas perguntas armazenadas no localStorage*/
        //console.log('Perguntas atualizadas no jogo:', perguntas);
    } else {
        console.log('Nenhuma pergunta encontrada no localStorage.');
    }
};
//-----------------------------------------------------------------------------

//------------------------------------------------------------------------
// Quando o documento estiver pronto
$(document).ready(function () {
    // Resetar perguntas quando a página é carregada ou atualizada
    resetarPergunta();

    // Carrega perguntas do localStorage para a variável global perguntas
    carregarPerguntasDoLocalStorage();

    // Atualiza a interface do jogo com as perguntas carregadas
    atualizarInterfaceComNovasPerguntas();


});


//------------------------------------------------------------
//Funcionalidades da capa do game
function capaOff() {
    $('#quizOptions').addClass('oculto');
    $('#quizOptions').removeClass('quizOptionsOn');


    //Adiciona um atraso antes de aplicar a class oculto
    setTimeout(function () {
        $('.capa').addClass('desligaCapa'); // Adiciona a classe 'desligaCapa' à div .capa
    }, 1500);  //Ajusta o tempo de atraso em milisegundos


    //Adiciona um atraso antes de aplicar a class oculto
    setTimeout(function () {
        $('.capa').addClass('oculto'); // Adiciona a classe 'oculto' à div .capa
    }, 5000);  //Ajusta o tempo de atraso em milisegundos

    //Remove a class .oculto da div #quiz depois de 6s
    setTimeout(function () {
        $('#quiz').removeClass('oculto');

        // Exibir a mensagem de boas-vindas 1s após abrir a div #quiz
        setTimeout(function () {
            let nomeJogador = recuperarDados('nomeAnterior');
            exibirMensagemBoasVindas(nomeJogador);
        }, 1000);

    }, 6000);    //Ajusta o tempo de atraso em milisegundos
};

//--------------------------------------------------------------------

// Evento de clique para o botão "X" (fechar modal anterior)
$('#closer').click(function (event) {
    event.stopPropagation();
    // Zerar ou remover a pontuação do localStorage para o próximo jogador
    //salvarDados('pontuacaoAnterior', 0);
    fecharModalAnterior();
    abrirModalNovoJogador();

    //Limpar o campo id #nomeJogador
    $('#nomeJogador').val('').focus();

});
//------------------------------------------------------------
//Cria objeto de audio para o som de erro(segundo click no botão ligar para um amigo)
let erroCampoNome = new Audio('sound/errou.mp3');

//Function para mostrar modal do erro do campo nome vazio
function mostrarModalCampoNome(idModal, mensagem) {
    // Remove a classe .oculto para exibir o modal
    $(idModal).removeClass('oculto').text(mensagem).fadeIn(500).delay(3000).fadeOut(500, function () {
        // Adiciona a classe .oculto novamente após o modal desaparecer
        $(this).addClass('oculto');
    });
}

//-------------------------------------------------------------
// Evento de clique para o botão "Salvar" (salvar nome do novo jogador)
$('#btnSalvarNome').click(function () {
    // Obter o nome do novo jogador
    let nomeJogador = $('#nomeJogador').val();

    //Verificação se o campo nome do jogador não está vazio
    if (nomeJogador === "") {
        // Tocar som de erro
        erroCampoNome.play();
        // Mostrar modal de aviso
        mostrarModalCampoNome('#modalCampoNomeJogador', 'O campo nome do jogador não pode estar vazio!!!');
        return;
    }

    salvarNomeNovoJogador();
    salvarDados('pontuacaoAnterior', 0);
    fecharModalNovoJogador();
    capaOff(); // Chama a função quando o botão é clicado  

    // Chama a função para resetar o cronômetro para zero após 500 milissegundos
    resetarParaZero();
    // Reseta a pergunta
    resetarPergunta();

});

//Evento de click no botão "x" da div id #novoJogador
$('#closeded').click(function (event) {
    event.stopPropagation();   //Impedir a propagação do evento de clique para a div .capa
    fecharModalNovoJogador();
    resetarPergunta();
});


//--------------------------------------------------------------------
//Funcionalidades da capa do game


$(document).ready(function () {
    // Adicione um evento de clique aos botões dentro da div .capa
    $('.capa button').click(function (event) {
        // Impedir a propagação do evento de clique para a div .capa
        event.stopPropagation();
    });
});

//-----------------------------------------------------------------


// Evento de clique na div .capa ligando e desligando as opções de quiz
$('.capa').click(function () {
    $('#quizOptions').toggleClass('oculto quizOptionsOn');

});

//--------------------------------------------------------------------------
//Emoji de moeda
const emojiMoeda = '\u{1FA99}';
// Função para exibir o nome e a pontuação do jogador anterior
function mostrarJogadorAnterior() {
    // Recuperar nome e pontuação do localStorage
    let nomeAnterior = recuperarDados('nomeAnterior');
    let pontuacaoAnterior = recuperarDados('pontuacaoAnterior');

    // Se o nome e a pontuação forem encontrados, exibi-los no modal
    if (nomeAnterior && pontuacaoAnterior !== null) {
        $('#nomeAnterior').html(nomeAnterior);
        $('#pontuacaoAnterior').html(`Pontuação: ${pontuacaoAnterior} ${emojiMoeda}`);

    } else {
        // Se não forem encontrados, exibir uma mensagem
        $('#nomeAnterior').html('Bem vindo ao game! Digite seu nome na próxima janela!');
        $('#pontuacaoAnterior').html(`Pontuação: 0 ${emojiMoeda}`);

    }
    // Zerar ou remover a pontuação do localStorage para o próximo jogador
    //salvarDados('pontuacaoAnterior', 0);
    $('#modalAnterior').removeClass('oculto');
};

//-----------------------------------------------------------------
//Cria objeto de audio para o som de erro(segundo click no botão ligar para um amigo)
let erroPerguntas = new Audio('sound/errou.mp3');

//Function para mostrar modal do erro do campo nome vazio
function mostrarModalPerguntas(idModal, mensagem) {
    // Remove a classe .oculto para exibir o modal
    $(idModal).removeClass('oculto').text(mensagem).fadeIn(500).delay(3000).fadeOut(500, function () {
        // Adiciona a classe .oculto novamente após o modal desaparecer
        $(this).addClass('oculto');
    });
}
//----------------------------------------------------------------
// Evento de clique para o botão Meu Quiz
$('#meuQuiz').click(function () {
    // Recupera o array de perguntas do localStorage
    let perguntas = JSON.parse(localStorage.getItem('perguntas')) || [];

    // Verifica se o array de perguntas está vazio
    if (perguntas.length === 0) {
        // Exibe o modal informando que devem ser criadas perguntas
        mostrarModalPerguntas('#modalPerguntas', 'Por favor, crie suas perguntas antes de iniciar este modo de jogo!');
    } else {
        // Se há perguntas salvas, segue o evento de clique normalmente
        mostrarJogadorAnterior(); // Exibe o nome e a pontuação do jogador anterior
    }
});

//--------------------------------------------------------------------------
function iniciarPontuacao() {

    pontuacaoAtual = 0;
    mostrarPontuacao();
}

//--------------------------------------------------------------------------
// Funções de inicialização
$(document).ready(function () {
    let novoJogo = recuperarDados('novoJogo');
    if (!novoJogo) {
        newGame();
    }
});
//--------------------------------------------------------------------------
// Função para armazenar a pontuação final
function armazenarPontuacao() {
    // Obter o nome do jogador do localStorage
    let nomeJogador = recuperarDados('nomeAnterior');
    if (nomeJogador) {
        // Salvar a pontuação do jogador com a chave específica
        salvarDados('pontuacaoAnterior', pontuacaoAtual);
    }
}
//--------------------------------------------------------------------------
// Função para atualizar a pontuação
function atualizarPontuacao() {
    pontuacaoAtual += valorPergunta;
    mostrarPontuacao();
}
//----------------------------------------------------------------
// Função para exibir a pontuação
function mostrarPontuacao() {
    //const emojiMoeda = '\u{1FA99}';
    $('#pontuacaoAtual').html(`${pontuacaoAtual} ${emojiMoeda} `);
}
//-------------------------------------------------------------
// Variável global para armazenar o nome do jogador
let nomeJogadorGlobal = '';

//----------------------------------------------------------------

//---------------------------------------------------------------
// Função para salvar o nome do novo jogador e iniciar o jogo
function salvarNomeNovoJogador() {
    // Obter o nome do novo jogador
    let nomeJogador = $('#nomeJogador').val();


    // Atualizar a variável global com o nome do jogador
    nomeJogadorGlobal = nomeJogador;

    // Salvar o nome no localStorage
    salvarDados('nomeAnterior', nomeJogador);

    // Inicializar a pontuação se ainda não existir
    if (recuperarDados('pontuacaoFinal') === null) {
        salvarDados('pontuacaoFinal', 0);
    }

    // Fechar o modal
    fecharModalNovoJogador();
    // iniciar a animação da capa para o inicio de um novo jogo
    capaOff(); // Chama a animação da capa desaparecendo quando o botão é clicado


}
//-------------------------------------------------------------
// Função para armazenar dados no localStorage
function salvarDados(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

//------------------------------------------------------------

// Função para recuperar dados do localStorage
function recuperarDados(chave) {
    const valorArmazenado = localStorage.getItem(chave);
    if (valorArmazenado) {
        return JSON.parse(valorArmazenado);
    } else {
        return null;
    }
};

//---------------------------------------------------------------
// Função para abrir o modal para o novo jogador inserir seu nome
function abrirModalNovoJogador() {
    $('#modalNovoJogador').removeClass('oculto');
}
//----------------------------------------------------------------
// Função para fechar o modal para o novo jogador
function fecharModalNovoJogador() {
    $('#modalNovoJogador').addClass('oculto');
}
//----------------------------------------------------------------
// Função para abrir o modal anterior
function abrirModalAnterior() {
    $('#modalAnterior').removeClass('oculto');
}
//----------------------------------------------------------------
// Função para fechar o modal anterior
function fecharModalAnterior() {
    $('#modalAnterior').addClass('oculto');
}
//-----------------------------------------------------------------


//--------------------------------------------------------------------------



//-----------------------------------------------------------------






//------------------------------------------------------------------

// Variáveis de controle do nosso jogo.
let pontuacao = 0;
let pontuacaoAtual = 0;
let valorPergunta = 0;
let currentQuestion = 0;
let perguntasFeitas = [];

//-----------------------------------------------------------------
// Funções

function recuperarPontuacao() {
    // Recupere a pontuação final do localStorage
    let pontuacaoArmazenada = localStorage.getItem("pontuacaoFinal");
    if (pontuacaoArmazenada) {
        pontuacao = parseInt(pontuacaoArmazenada);
    }
}
//-----------------------------------------------------------------
//Desta forma, o jogo vai ter uma quantidade de perguntas dinâmica. Se eu for acrecentando mais perguntas, vai atualizando automaticamente a quantia de perguntas.
//let qtdPerguntas = perguntas.length - 1;

let vencedorSound = new Audio('sound/vencedor.mp3');

//-----------------------------------------------------------------

//Gerando as perguntas
function gerarPergunta() {

    resetarBotaoConfirm();

    // Verificar novo jogo
    let novoJogo = recuperarDados('novoJogo');
    if (novoJogo) {
        indicePergunta = 0;
        perguntasFeitas = [];
        novoJogo = false;
        salvarDados('novoJogo', novoJogo);
    }

    // Obter o número total de perguntas
    let totalPerguntas = perguntas.length;

    //Gerar número aleatório
    let aleatorio = Math.floor(Math.random() * totalPerguntas);

    //Mostrar no console qual foi a pergunta sorteada
    console.log(`A pergunta sorteada foi a  pergunta ${aleatorio}`);

    // Gerar valor aleatório da pergunta para pontuação
    valorPergunta = Math.floor(Math.random() * 5) + 1; // Entre 1 e 5 pontos

    //Verificar se a pergunta sorteada já foi feita, ou seja, se já esta no array perguntasFeitas! 
    if (!perguntasFeitas.includes(aleatorio)) {
        //Colocar a pergunta sorteada no array de perguntasFeitas
        perguntasFeitas.push(aleatorio);




        //debugando...
        //verifica no console.log o array perguntas feitas
        console.log(`Conteúdo do array perguntasFeitas:${perguntasFeitas}.`);

        //preencher o html com os dados da questão sorteada
        let p_selecionada = perguntas[aleatorio].pergunta;

        console.log(p_selecionada);
        //Alimentar a pergunta no html vinda do sorteio
        $("#pergunta").html(p_selecionada);
        $('#pergunta').attr('data-indice', aleatorio);
        //Colocar as respostas no html com laço
        for (let i = 0; i < perguntas[aleatorio].respostas.length; i++) {
            $('#resp' + i).html(perguntas[aleatorio].respostas[i])
        }

        //---------------------------------------------------------

        //Embaralhar as respostas
        let pai = $('#respostas');
        let botoes = pai.children();  //Método jQuery para pegar todos os filhos do pai

        for (let i = 1; i < botoes.length; i++) {
            pai.append(botoes.eq(Math.floor(Math.random() * botoes.length)));
        }
    } else {
        //Se a pergunta já foi feita
        console.log('A pergunta já foi feita. Sorteando novamente!!!');

        return gerarPergunta();

    }
};
//------------------------------------------------------------------------
//Se o data-status não está travado, reseta todos os botoes das respostas e marca a resposta selecionada
$('.resposta').click(function () {
    if ($('#quiz').attr('data-status') !== 'travado') {
        //Percorrer todas as respostas e desmarcar a classe selecionada
        resetaBotoes();
        //Adiciona a classe selecionada
        $(this).addClass('selecionada');

    }
});

//---------------------------------------------------------------
// Função para resetar o estado do botão #confirm quando necessário
function resetarBotaoConfirm() {
    confirmado = false;
}

//---------------------------------------------------------
//Cria um objeto de audio para o som de resposta errada
let errouSound = new Audio('sound/errou.mp3');
let gameOverSound = new Audio('sound/gameOverError.mp3');

//---------------------------------------------------------
let confirmado = false;

//---------------------------------------------------------------

// Evento de click do botão confirmar : Verificação se a resposta está correta
$('#confirm').click(function () {

    //Pegar o índice da pergunta
    let indice = $('#pergunta').attr('data-indice');

    let totalPerguntas = perguntas.length;

    //Qual é a resposta correta?
    let respCerta = perguntas[indice].correta;

    //Qual foi a resposta que o usuário selecionou
    $('.resposta').each(function () {
        if ($(this).hasClass('selecionada')) {
            let respSelecionada = $(this).attr('id');
            if (respCerta === respSelecionada) {
                console.log('Acertou!');
                atualizarPontuacao();
                mostrarPontuacao();

                // Verifica se é a última pergunta antes de chamar a próxima pergunta
                if (perguntasFeitas.length >= totalPerguntas) { // Subtrai 1 porque o índice começa em 0
                    pararCronometro();
                    vencedorSound.play(); // Toca o som de vitória
                    $('#quiz').addClass('oculto');
                    $('#mensagem').html('Parabéns!!! Você venceu!!!');
                    $('#status').removeClass('oculto');
                    armazenarPontuacao();

                } else {
                    proximaPergunta();
                }

            } else {
                console.log('Errou!');
                errouSound.play();    //Reproduz o som de erro
                pararCronometro(); // Para o cronômetro se a resposta estiver errada

                $('#quiz').attr('data-status', 'travado');
                $('#confirm').addClass('oculto');
                $('#' + respCerta).addClass('correta');
                $('#' + respSelecionada).removeClass('selecionada');
                $('#' + respSelecionada).addClass('errada');


                //4s para mostrar o game over
                setTimeout(function () {
                    gameOverSound.play();
                    gameOver()

                }, 4000);
            }
        }
    });
    // Verifica se uma resposta foi selecionada antes de marcar como confirmado
    if ($('.resposta.selecionada').length > 0) {
        confirmado = true;
        resetarCronometro(); // Reseta o cronômetro após clicar em confirmar

    }


});

//--------------------------------------------------------------



// Variável para rastrear o número de pulos
let contadorPulos = 0;
const maxPulos = 2; // Número máximo de pulos permitidos

//Cria um objeto de audio para o som de erro(terceiro click no botão pular pergunta)
let fimPuloSound = new Audio('sound/errou.mp3');


// Função para mostrar o modal
function mostrarModal(idModal, mensagem) {
    // Remove a classe .oculto para exibir o modal
    $(idModal).removeClass('oculto').text(mensagem).fadeIn(500).delay(3000).fadeOut(500, function () {
        // Adiciona a classe .oculto novamente após o modal desaparecer
        $(this).addClass('oculto');
    });
}

function pulaPergunta() {
    console.log(`Pulo atual: ${contadorPulos}`); // Verifica o número atual de pulos

    let totalPerguntas = perguntas.length;

    // Verifica se o jogador ainda pode pular perguntas
    if (contadorPulos < maxPulos) {

        // Mostra o modal correspondente ao número de pulos
        if (contadorPulos === 0) {
            mostrarModal('#firstPulo', 'Você pulou uma pergunta! Poderá pular apenas mais uma!');
        } else if (contadorPulos === 1) {
            mostrarModal('#secondPulo', 'Você pulou a segunda pergunta! Não pode mais pular perguntas! 😏');
        }


        // Remove a última pergunta do array e mostra no console
        if (perguntasFeitas.length > 0) {
            const perguntaRemovida = perguntasFeitas.pop();
            console.log(`Pergunta removida do array: ${perguntaRemovida}.`);
        }

        // Incrementa o contador de pulos
        contadorPulos++;

        //Reseta a seleção dos botões de resposta
        resetaBotoes();

        // Gera uma nova pergunta
        gerarPergunta(totalPerguntas);

        // Inicia o cronômetro
        iniciarCronometro();


    } else {
        // Reproduz o som de erro
        fimPuloSound.play();
    }
}



// Evento de clique no botão id #nextQuestion
$('#nextQuestion').click(function () {
    pulaPergunta();
});

//----------------------------------------------------------------
//------------------------------------------------------------------
//Ligando para um amigo para pedir dica de uma pergunta

//Rastreando o nº de ligações 
//variável para rastrear o nº de ligações permitidas
let contadorDeLigacoes = 0;
const maxDeligacoes = 1;

//Cria objeto de audio para o som de som da chamada
let chamadaSound = new Audio('sound/callMyFriend1.mp3');


//Cria objeto de audio para o som de erro(segundo click no botão ligar para um amigo)
let fimCallSound = new Audio('sound/errou.mp3');

//Function para mostrar modal do score de ligações permitidas
function mostrarModalLigacoes(idModal, mensagem) {
    // Remove a classe .oculto para exibir o modal
    $(idModal).removeClass('oculto').text(mensagem).fadeIn(500).delay(3000).fadeOut(500, function () {
        // Adiciona a classe .oculto novamente após o modal desaparecer
        $(this).addClass('oculto');
    });
}
//---------------------------------------------------------------------
// Função para usar a Web Speech API para converter texto em fala
function falarTexto(texto) {
    return new Promise((resolve, reject) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const utterThis = new SpeechSynthesisUtterance(texto);
            utterThis.lang = 'pt-BR'; // Configurar o idioma para português brasileiro

            // Resolver a promessa quando a fala terminar
            utterThis.onend = () => resolve();
            // Rejeitar a promessa em caso de erro
            utterThis.onerror = (event) => reject(event.error);

            synth.speak(utterThis);
        } else {
            reject(new Error('Web Speech API não é suportada neste navegador.'));
        }
    });
}

//------------------------------------------------------
$('#callFriend').click(async function () {
    console.log(`Ligação atual: ${contadorDeLigacoes}`);

    if (contadorDeLigacoes < maxDeligacoes) {
        mostrarModalLigacoes('#firstPulo', 'Você não tem mais ligações disponíveis!');

        pararCronometro();

        chamadaSound.play();
        contadorDeLigacoes++;

        setTimeout(async function () {
            chamadaSound.pause();
            chamadaSound.currentTime = 0;

            let nomeJogador = recuperarDados('nomeAnterior');
            let indicePergunta = $('#pergunta').attr('data-indice');
            let dicaPergunta = perguntas[indicePergunta].dica;

            let textoParaAmigo = `Oi ${nomeJogador}! A dica para esta pergunta é a seguinte: ${dicaPergunta} ok? Tchau!!!`;

            // Chamar a função de fala da Web Speech API após a chamada telefônica
            try {
                await falarTexto(textoParaAmigo);
            } catch (error) {
                console.error('Erro ao usar a Web Speech API:', error);
            }

            // Retomar o cronômetro e o som após a fala do amigo
            setTimeout(function () {
                if (cronometroParado) {
                    let startTime = Date.now();
                    let endTime = startTime + tempoPausado;

                    audioTicTac.play();

                    cronometroInterval = setInterval(function () {
                        let now = Date.now();
                        tempoRestante = endTime - now;

                        if (tempoRestante <= 0) {
                            tempoRestante = 0;
                            clearInterval(cronometroInterval);
                            audioTicTac.pause();
                            audioTicTac.currentTime = 0;
                            audioFinalTime.play();
                            gameOver();
                        }

                        atualizarDisplay(tempoRestante);
                    }, 10);

                    cronometroParado = false;
                }
            }, 4000); // Definir o tempo para retomar (12 segundos após a fala)
        }, 4000); // Definir o tempo para iniciar a fala do amigo (4 segundos após a chamada telefônica)

    } else {
        fimCallSound.play();
    }
});




//---------------------------------------------------------------

function newGame() {
    $('#confirm').removeClass('oculto');
    $('#quiz').attr('data-status', 'ok');
    perguntasFeitas = [];
    resetaBotoes();
    //exibirPerguntas();     // Chama a função exibirPergunta aqui
    //gerarPergunta();
    //-------------------------------
    // Inicializar pontuação
    iniciarPontuacao();

    //$('#quiz').removeClass('oculto');
    $('#status').addClass('oculto');

    //-----------------------------------
    contadorDeLigacoes = 0; // Resetar contador de ligações
    cronometroParado = false; // Resetar estado do cronômetro
    cronometroPausado = false; // Resetar estado de pausa do cronômetro
    tempoRestante = 15 * 1000; // Resetar tempo restante do cronômetro


}

//---------------------------------------------------------------
function proximaPergunta() {
    let totalPerguntas = perguntas.length;
    resetaBotoes()
    gerarPergunta(totalPerguntas);
    iniciarCronometro(); // Reinicia o cronômetro na próxima pergunta
}

//----------------------------------------------------------
function resetaBotoes() {
    $('.resposta').each(function () {

        $(this).removeClass('selecionada correta errada');
    });
};

//-----------------------------------------------------

function gameOver() {
    clearInterval(cronometroInterval); // Para o cronômetro no game over
    $('#quiz').addClass('oculto');
    $('#mensagem').html('Game Over! Tente novamente!');
    $('#status').removeClass('oculto');

    // Salvar a pontuação final
    armazenarPontuacao();

    // Mostrar pontuação final
    $('#pontuacaoFinal').html(pontuacaoAtual);

    // Limpa a pergunta exibida ao terminar o jogo
    //$('#pergunta').html('');
    resetarPergunta()
}


// Evento de clique para iniciar um novo jogo
//$('#novoJogo').click(newGame);

//------------------------------------------------------------------
// Evento de clique para o botão #sair para sair do jogo
$('#sair').click(function () {
    toggleClasses(); // Chama a função quando o botão é clicado
    // Reseta o contador de pulos
    contadorPulos = 0;

    // Resetar contador de ligações
    //contadorDeLigacoes = 0;
});
//----------------------------------------------------------------

// Função para adicionar e remover a classe 'oculto'
function toggleClasses() {
    $('#status').addClass('oculto'); // Adiciona a classe 'oculto' à div #status
    $('.capa').removeClass('desligaCapa');  //Remove a class desligaCapa da div .capa
    $('.capa').removeClass('oculto'); // Remove a classe 'oculto' da div .capa

    // Remover o data-status "travado" da div #quiz
    $('#quiz').removeAttr('data-status');

    // Reiniciar o jogo
    newGame();

    //contadorDeLigacoes = 0;
}

//--------------------------------------------------------------------

//Abrir form
$(document).ready(function () {
    $('#formOn').click(function () {
        //alert("Botao crie seu quiz clicado!");
        $('#quizOptions').removeClass('quizOptionsOn')
        $('#quizOptions').addClass('oculto')
        $('.entradaDados').removeClass('oculto')
    });
});


//---------------------------------------------------------

//Esconder o form
$(document).ready(function () {
    $('#formOff').click(function () {
        $('.entradaDados').addClass('oculto')
        $('#quizOptions').removeClass('oculto')
        $('#quizOptions').addClass('quizOptionsOn')
    });
});

//------------------------------------------------------
//Configurando a primeira letra maiúscula do input id #nomeJogador
$(document).ready(function () {
    $('#nomeJogador').on('input', function () {
        let inputValue = $(this).val();
        if (inputValue.length > 0) {
            $(this).val(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
        }
    });
});

//----------------------------------------------
//Estilização da primeira letra maiúscula
//Converter a primeira letra inserida nos inputs para maiúscula
$('#novaPerguntaForm input[type="text"]').on('input', function () {
    let inputValue = $(this).val();
    if (inputValue.length > 0) {
        $(this).val(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
    }
});

