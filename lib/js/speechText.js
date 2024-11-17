//------------------------------------------------------------------
$(document).ready(function () {
    let recognition;

    // Verifica se o navegador suporta a API de reconhecimento de fala
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";

        // Quando o reconhecimento começa
        recognition.onstart = function () {
            $('#microphoneButton').prop('disabled', true).text("🎤 Ouvindo...");
        };

        // Quando o reconhecimento termina com um resultado
        recognition.onresult = function (event) {
            const spokenText = event.results[0][0].transcript;
            const $activeElement = $(':focus');

            if ($activeElement.is('input')) {
                $activeElement.val($activeElement.val() + spokenText);
            }

            $('#microphoneButton').prop('disabled', false).html('<i class="fa-solid fa-microphone-lines"></i>');
        };

        // Quando ocorre um erro
        recognition.onerror = function (event) {
            console.error("Erro no reconhecimento de fala:", event.error);
            $('#microphoneButton').prop('disabled', false).html('<i class="fa-solid fa-microphone-lines"></i>');
        };

        // Quando o reconhecimento termina
        recognition.onend = function () {
            $('#microphoneButton').prop('disabled', false).html('<i class="fa-solid fa-microphone-lines"></i>');
        };

        // Mantém o foco no input quando o botão é clicado
        $('#microphoneButton').on('mousedown', function (e) {
            e.preventDefault();
        });

        // Evento de clique no botão de microfone
        $('#microphoneButton').click(function () {
            recognition.start();
        });
    } else {
        $('#microphoneButton').prop('disabled', true);
        alert("Seu navegador não suporta reconhecimento de fala.");
    }
});


