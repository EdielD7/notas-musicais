// Definição dos conjuntos de notas para cada modo
const noteSets = {
    // Modo 1: Apenas notas naturais
    natural: ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'],

    // Modo 2: 12 notas com sustenidos
    sharps: ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'],

    // Modo 3: 12 notas com bemóis
    flats: ['Dó', 'Ré♭', 'Ré', 'Mi♭', 'Mi', 'Fá', 'Sol♭', 'Sol', 'Lá♭', 'Lá', 'Si♭', 'Si']
};

// Mapeamento de caracteres acentuados para não acentuados
const accentMap = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ç': 'c'
};

// Referências aos elementos HTML
const currentNoteElement = document.getElementById('currentNote');
const previousNoteInput = document.getElementById('previousNote');
const nextNoteInput = document.getElementById('nextNote');
const startButton = document.getElementById('startButton');
const checkButton = document.getElementById('checkButton');
const messageElement = document.getElementById('message');
const modeRadios = document.querySelectorAll('input[name="mode"]');

// Variáveis para armazenar o estado do jogo
let currentNoteIndex;
let currentNotes;

// Função para obter o modo selecionado
function getSelectedMode() {
    let selectedMode = 'natural'; // Valor padrão

    // Verifica qual modo está selecionado
    for (const radio of modeRadios) {
        if (radio.checked) {
            selectedMode = radio.value;
            break;
        }
    }

    return selectedMode;
}

// Função para iniciar o jogo
function startGame() {
    // Limpa campos e mensagens anteriores
    previousNoteInput.value = '';
    nextNoteInput.value = '';
    messageElement.textContent = '';
    messageElement.className = '';

    // Habilita o botão de verificação e os campos de entrada
    checkButton.disabled = false;
    previousNoteInput.disabled = false;
    nextNoteInput.disabled = false;

    // Obtém o conjunto de notas com base no modo selecionado
    const selectedMode = getSelectedMode();
    currentNotes = noteSets[selectedMode];

    // Seleciona uma nota aleatória (evitando a primeira e última para exercícios com poucas notas)
    const maxIndex = currentNotes.length - 1;

    // Se tivermos apenas as 7 notas naturais, garantimos que possamos ter anterior e próxima
    if (currentNotes.length <= 7) {
        currentNoteIndex = Math.floor(Math.random() * (maxIndex - 1)) + 1;
    } else {
        // Para 12 notas, qualquer nota pode ser selecionada pois trabalhamos em ciclo
        currentNoteIndex = Math.floor(Math.random() * currentNotes.length);
    }

    // Exibe a nota selecionada na interface
    currentNoteElement.textContent = currentNotes[currentNoteIndex];
}

// Função para verificar a resposta do usuário
function checkAnswer() {
    // Obtém as respostas do usuário
    const userPreviousNote = previousNoteInput.value.trim();
    const userNextNote = nextNoteInput.value.trim();

    // Calcula os índices corretos para as notas anterior e próxima (com wrapping circular)
    const correctPreviousIndex = (currentNoteIndex - 1 + currentNotes.length) % currentNotes.length;
    const correctNextIndex = (currentNoteIndex + 1) % currentNotes.length;

    // Obtém as notas corretas
    const correctPreviousNote = currentNotes[correctPreviousIndex];
    const correctNextNote = currentNotes[correctNextIndex];

    // Normaliza as entradas para comparação
    const normalizedUserPrevious = normalizeNoteForComparison(userPreviousNote);
    const normalizedUserNext = normalizeNoteForComparison(userNextNote);
    const normalizedCorrectPrevious = normalizeNoteForComparison(correctPreviousNote);
    const normalizedCorrectNext = normalizeNoteForComparison(correctNextNote);

    // Verifica se as respostas estão corretas
    const isPreviousCorrect = normalizedUserPrevious === normalizedCorrectPrevious;
    const isNextCorrect = normalizedUserNext === normalizedCorrectNext;

    // Exibe mensagem de acordo com o resultado
    if (isPreviousCorrect && isNextCorrect) {
        messageElement.textContent = "Parabéns! Você acertou ambas as notas!";
        messageElement.className = "success";

        // Mostra as respostas corretas para reforçar o aprendizado
        if (getSelectedMode() !== 'natural') {
            messageElement.textContent += ` A sequência correta é: ${correctPreviousNote} → ${currentNotes[currentNoteIndex]} → ${correctNextNote}`;
        }

        // Desabilita os campos após resposta correta
        previousNoteInput.disabled = true;
        nextNoteInput.disabled = true;
        checkButton.disabled = true;
    } else {
        messageElement.textContent = "Tente novamente. Verifique suas respostas.";
        messageElement.className = "error";
    }
}

// Função para remover acentos de um caractere
function removeAccent(char) {
    return accentMap[char.toLowerCase()] || char.toLowerCase();
}

// Função para normalizar notas para comparação (ignora acentos, espaços e símbolos diferentes)
function normalizeNoteForComparison(note) {
    if (!note) return '';

    // Converte para minúsculas
    let normalized = note.toLowerCase();

    // Remove espaços
    normalized = normalized.replace(/\s+/g, '');

    // Remove acentos
    normalized = normalized.split('').map(char => removeAccent(char)).join('');

    // Normaliza variações de sustenido
    normalized = normalized.replace(/[♯#s]/g, '#');

    // Normaliza variações de bemol
    normalized = normalized.replace(/[♭b]/g, 'b');

    // Normaliza nomes de notas (para comparação básica)
    normalized = normalized.replace(/^do/, 'do');
    normalized = normalized.replace(/^re/, 're');
    normalized = normalized.replace(/^mi/, 'mi');
    normalized = normalized.replace(/^fa/, 'fa');
    normalized = normalized.replace(/^sol/, 'sol');
    normalized = normalized.replace(/^la/, 'la');
    normalized = normalized.replace(/^si/, 'si');

    return normalized;
}

// Adiciona event listeners aos botões
startButton.addEventListener('click', startGame);
checkButton.addEventListener('click', checkAnswer);

// Event listener para verificar quando o usuário pressiona Enter nos campos de entrada
previousNoteInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        nextNoteInput.focus();
    }
});

nextNoteInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !checkButton.disabled) {
        checkAnswer();
    }
});

// Event listeners para os radio buttons de modo
for (const radio of modeRadios) {
    radio.addEventListener('change', function () {
        // Reinicia o estado do jogo quando o modo é alterado
        currentNoteElement.textContent = '?';
        previousNoteInput.value = '';
        nextNoteInput.value = '';
        messageElement.textContent = '';
        messageElement.className = '';
        checkButton.disabled = true;
        previousNoteInput.disabled = true;
        nextNoteInput.disabled = true;
    });
}