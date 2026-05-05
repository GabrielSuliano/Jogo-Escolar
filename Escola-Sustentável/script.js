/* ============================================
   DADOS DO JOGO
   ============================================ */

var nomeJogador = '';
var turmaJogador = '';
var categoriaAtual = 0;
var pontosTotal = 0;
var pontuacaoPorCategoria = {};
var temporizadorAtivo = null;
var segundosRestantes = 15;
var duracaoRodada = 15;
var rodadaRespondida = false;

var missoesRelampago = [
    'Decida antes do tempo acabar para proteger sua escola!',
    'Pense no futuro do planeta antes de escolher!',
    'Escolha a opcao mais verde para desbloquear conquistas!',
    'Analise os impactos da sua escolha no dia a dia da escola!',
    'Missao: priorize saude, natureza e economia de recursos!'
];

var categorias = [
    {
        id: 'reciclagem',
        titulo: '♻️ Reciclagem Inteligente',
        icone: 'icone-reciclagem',
        pergunta: 'Como você gostaria de organizar a reciclagem na sua escola?',
        opcoes: [
            { icone: '🗑️', titulo: 'Sem lixeiras', desc: 'Não ter lixeiras especiais', pontos: 0 },
            { icone: '♻️', titulo: 'Poucas lixeiras', desc: 'Ter algumas lixeiras de reciclagem', pontos: 5 },
            { icone: '🌿', titulo: 'Coleta Seletiva', desc: 'Lixeiras separadas por tipo', pontos: 10 }
        ]
    },
    {
        id: 'energia',
        titulo: '⚡ Energia Limpa',
        icone: 'icone-energia',
        pergunta: 'Qual tipo de energia você escolhe para a escola?',
        opcoes: [
            { icone: '🔌', titulo: 'Energia Comum', desc: 'Energia elétrica tradicional', pontos: 0 },
            { icone: '💡', titulo: 'Economia', desc: 'Lâmpadas LED e eficiência', pontos: 5 },
            { icone: '☀️', titulo: 'Energia Solar', desc: 'Painéis solares na escola', pontos: 10 }
        ]
    },
    {
        id: 'agua',
        titulo: '💧 Água Consciente',
        icone: 'icone-agua',
        pergunta: 'Como você vai gerenciar a água na escola?',
        opcoes: [
            { icone: '🚿', titulo: 'Uso Normal', desc: 'Sem controle de consumo', pontos: 0 },
            { icone: '💧', titulo: 'Economia', desc: 'Torneiras inteligentes', pontos: 5 },
            { icone: '🌊', titulo: 'Reuso Total', desc: 'Captação de chuva', pontos: 10 }
        ]
    },
    {
        id: 'verde',
        titulo: '🌱 Biodiversidade',
        icone: 'icone-verde',
        pergunta: 'Como você vai criar espaços verdes na escola?',
        opcoes: [
            { icone: '🏚️', titulo: 'Sem Áreas Verdes', desc: 'Escola só com concreto', pontos: 0 },
            { icone: '🌳', titulo: 'Algumas Árvores', desc: 'Árvores nos corredores', pontos: 5 },
            { icone: '🦋', titulo: 'Jardim Biodiverso', desc: 'Jardins com muitas plantas', pontos: 10 }
        ]
    },
    {
        id: 'transporte',
        titulo: '🚌 Transportes Verdes',
        icone: 'icone-transporte',
        pergunta: 'Que tipo de transporte você incentiva?',
        opcoes: [
            { icone: '🚗', titulo: 'Carros', desc: 'Todos vêm de carro', pontos: 0 },
            { icone: '🚌', titulo: 'Ônibus/Bicicleta', desc: 'Transportes coletivos', pontos: 5 },
            { icone: '🚴', titulo: 'Zero Carbono', desc: 'Bicicletas e caminhada', pontos: 10 }
        ]
    },
    {
        id: 'comida',
        titulo: '🥗 Alimentação Saudável',
        icone: 'icone-comida',
        pergunta: 'Que tipo de alimentação a escola oferece?',
        opcoes: [
            { icone: '🍔', titulo: 'Ultra Processados', desc: 'Muito sódio e açúcar', pontos: 0 },
            { icone: '🥕', titulo: 'Alimentos Locais', desc: 'Vegetais da região', pontos: 5 },
            { icone: '🌽', titulo: 'Horta Orgânica', desc: 'Comida da horta escolar', pontos: 10 }
        ]
    },
    {
        id: 'consciencia',
        titulo: '📢 Consciência Ambiental',
        icone: 'icone-consciencia',
        pergunta: 'Como você divulga a sustentabilidade?',
        opcoes: [
            { icone: '🤐', titulo: 'Nenhuma Ação', desc: 'Não fazer nada', pontos: 0 },
            { icone: '📋', titulo: 'Cartazes', desc: 'Cartazes nas salas', pontos: 5 },
            { icone: '🎤', titulo: 'Campanhas', desc: 'Eventos e palestras', pontos: 10 }
        ]
    }
];

/* ============================================
   FUNCAO: NORMALIZAR TEXTO DO RANKING
   ============================================ */

function normalizarTexto(valor, fallback, limite) {
    if (typeof valor !== 'string') {
        return fallback;
    }

    var texto = valor.trim();
    if (texto === '') {
        return fallback;
    }

    return texto.substring(0, limite);
}

/* ============================================
   FUNCAO: NORMALIZAR ITEM DO RANKING
   ============================================ */

function normalizarItemRanking(jogador) {
    if (!jogador || typeof jogador !== 'object') {
        return null;
    }

    var pontos = Number(jogador.pontos);
    if (!isFinite(pontos)) {
        pontos = 0;
    }

    pontos = Math.max(0, Math.min(70, Math.round(pontos)));

    return {
        nome: normalizarTexto(jogador.nome, 'Jogador', 80),
        turma: normalizarTexto(jogador.turma, 'Turma nao informada', 50),
        pontos: pontos,
        data: normalizarTexto(jogador.data, '', 20)
    };
}

/* ============================================
   FUNCAO: LER RANKING COM SEGURANCA
   ============================================ */

function obterRankingSalvo() {
    var rankingJSON = null;

    try {
        rankingJSON = localStorage.getItem('rankingEscolaSustentavel');
    } catch (erro) {
        return [];
    }

    if (rankingJSON === null) {
        return [];
    }

    try {
        var ranking = JSON.parse(rankingJSON);
        if (!Array.isArray(ranking)) {
            return [];
        }

        var rankingNormalizado = [];
        var i = 0;
        while (i < ranking.length) {
            var jogador = normalizarItemRanking(ranking[i]);
            if (jogador !== null) {
                rankingNormalizado.push(jogador);
            }
            i++;
        }

        return rankingNormalizado;
    } catch (erro) {
        try {
            if (typeof localStorage.removeItem === 'function') {
                localStorage.removeItem('rankingEscolaSustentavel');
            }
        } catch (erroRemocao) {
            // Se o navegador bloquear o localStorage, seguimos com ranking vazio.
        }

        return [];
    }
}

/* ============================================
   FUNCAO: RESETAR PREVIEW DO JOGO
   ============================================ */

function resetarPreviewJogo() {
    var pontuacaoAtual = document.getElementById('pontuacaoAtual');
    if (pontuacaoAtual) {
        pontuacaoAtual.textContent = '0';
    }

    var barraVertical = document.getElementById('barraVertical');
    if (barraVertical) {
        barraVertical.style.height = '0%';
    }

    var barraHorizontal = document.getElementById('barraHorizontal');
    if (barraHorizontal) {
        barraHorizontal.style.width = '0%';
    }

    var barraTempo = document.getElementById('barraTempo');
    if (barraTempo) {
        barraTempo.style.width = '100%';
        barraTempo.classList.remove('urgente');
    }

    var tempoRestante = document.getElementById('tempoRestante');
    if (tempoRestante) {
        tempoRestante.textContent = definirTempoPorRodada(0) + 's';
    }

    var iconesAtivos = {};
    var i = 0;
    while (i < categorias.length) {
        iconesAtivos[categorias[i].icone] = true;
        i++;
    }

    for (var idIcone in iconesAtivos) {
        if (Object.prototype.hasOwnProperty.call(iconesAtivos, idIcone)) {
            var elemento = document.getElementById(idIcone);
            if (elemento) {
                elemento.classList.remove('ativo');
            }
        }
    }
}

/* ============================================
   FUNÇÃO: INICIAR O JOGO
   ============================================ */

function iniciarJogo() {
    var nome = document.getElementById('inputNome').value.trim();
    var turma = document.getElementById('inputTurma').value.trim();

    if (nome === '' || turma === '') {
        alert('Por favor, preencha seu nome e turma!');
        return;
    }

    nomeJogador = nome;
    turmaJogador = turma;
    categoriaAtual = 0;
    pontosTotal = 0;
    pontuacaoPorCategoria = {};
    rodadaRespondida = false;
    duracaoRodada = definirTempoPorRodada(0);
    segundosRestantes = duracaoRodada;
    pararTemporizador();
    resetarPreviewJogo();

    mudarTela('telaJogo');
    carregarCategoria(0);
}

/* ============================================
   FUNCAO: DEFINIR TEMPO DA RODADA
   ============================================ */

function definirTempoPorRodada(indice) {
    var tempoBase = 15 - indice;
    if (tempoBase < 9) {
        tempoBase = 9;
    }
    return tempoBase;
}

/* ============================================
   FUNCAO: INICIAR TEMPORIZADOR
   ============================================ */

function iniciarTemporizador(indiceCategoria) {
    pararTemporizador();

    duracaoRodada = definirTempoPorRodada(indiceCategoria);
    segundosRestantes = duracaoRodada;
    atualizarHUDTempo();

    temporizadorAtivo = setInterval(function() {
        segundosRestantes--;
        atualizarHUDTempo();

        if (segundosRestantes <= 0) {
            pararTemporizador();
            tempoEsgotado(indiceCategoria);
        }
    }, 1000);
}

/* ============================================
   FUNCAO: PARAR TEMPORIZADOR
   ============================================ */

function pararTemporizador() {
    if (temporizadorAtivo !== null) {
        clearInterval(temporizadorAtivo);
        temporizadorAtivo = null;
    }
}

/* ============================================
   FUNCAO: ATUALIZAR HUD DE TEMPO
   ============================================ */

function atualizarHUDTempo() {
    var tempoTexto = document.getElementById('tempoRestante');
    var barraTempo = document.getElementById('barraTempo');
    if (!tempoTexto || !barraTempo) {
        return;
    }

    tempoTexto.textContent = segundosRestantes + 's';
    var percentual = (segundosRestantes / duracaoRodada) * 100;
    barraTempo.style.width = percentual + '%';

    if (percentual <= 35) {
        barraTempo.classList.add('urgente');
    } else {
        barraTempo.classList.remove('urgente');
    }
}

/* ============================================
   FUNCAO: RODADA SEM RESPOSTA
   ============================================ */

function tempoEsgotado(indiceCategoria) {
    if (rodadaRespondida) {
        return;
    }

    rodadaRespondida = true;
    var categoria = categorias[indiceCategoria];
    pontuacaoPorCategoria[categoria.id] = 0;

    var textoMissao = document.getElementById('textoMissao');
    if (textoMissao) {
        textoMissao.textContent = 'Tempo esgotado! Esta rodada valeu 0 ponto.';
    }

    setTimeout(function() {
        carregarCategoria(indiceCategoria + 1);
    }, 800);
}

/* ============================================
   FUNÇÃO: CARREGAR CATEGORIA
   ============================================ */

function carregarCategoria(indice) {
    if (indice >= categorias.length) {
        pararTemporizador();
        calcularResultadoFinal();
        return;
    }

    categoriaAtual = indice;
    rodadaRespondida = false;
    var categoria = categorias[indice];

    document.getElementById('tituloCategoria').textContent = categoria.titulo;
    document.getElementById('numCategoria').textContent = 'Desafio ' + (indice + 1) + ' de ' + categorias.length;
    document.getElementById('textoPergunta').textContent = categoria.pergunta;

    var containerOpcoes = document.getElementById('containerOpcoes');
    containerOpcoes.innerHTML = '';

    var textoMissao = document.getElementById('textoMissao');
    if (textoMissao) {
        textoMissao.textContent = missoesRelampago[indice % missoesRelampago.length];
    }

    var opcoesEmbaralhadas = categoria.opcoes.slice();
    embaralharOpcoes(opcoesEmbaralhadas);

    var i = 0;
    while (i < opcoesEmbaralhadas.length) {
        var opcao = opcoesEmbaralhadas[i];
        var div = document.createElement('div');
        div.className = 'opcao';

        (function(indiceCategoriaAtual, pontosOpcao) {
            div.onclick = function(evt) {
                selecionarOpcao(indiceCategoriaAtual, pontosOpcao, evt);
            };
        })(indice, opcao.pontos);
        
        div.innerHTML = 
            '<span class="icone-opcao">' + opcao.icone + '</span>' +
            '<div class="pontos">Escolha estrategica</div>' +
            '<h3>' + opcao.titulo + '</h3>' +
            '<p>' + opcao.desc + '</p>';

        containerOpcoes.appendChild(div);
        i++;
    }

    // Atualizar barra de progresso
    var percentual = (indice / categorias.length) * 100;
    document.getElementById('barraHorizontal').style.width = percentual + '%';

    iniciarTemporizador(indice);
}

/* ============================================
   FUNCAO: EMBARALHAR OPCOES
   ============================================ */

function embaralharOpcoes(lista) {
    var i = lista.length - 1;
    while (i > 0) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = lista[i];
        lista[i] = lista[j];
        lista[j] = temp;
        i--;
    }
}

/* ============================================
   FUNÇÃO: SELECIONAR OPÇÃO
   ============================================ */

function selecionarOpcao(indiceCategoria, pontos, evento) {
    if (rodadaRespondida) {
        return;
    }

    rodadaRespondida = true;
    pararTemporizador();

    var opcoes = evento.currentTarget.parentNode.querySelectorAll('.opcao');
    var i = 0;
    while (i < opcoes.length) {
        opcoes[i].classList.remove('selecionada');
        opcoes[i].style.pointerEvents = 'none';
        i++;
    }

    evento.currentTarget.classList.add('selecionada');

    var categoria = categorias[indiceCategoria];
    pontuacaoPorCategoria[categoria.id] = pontos;
    pontosTotal += pontos;

    // Atualizar preview
    var elemento = document.getElementById(categoria.icone);
    if (elemento) {
        elemento.classList.add('ativo');
        setTimeout(function() {
            elemento.classList.remove('ativo');
        }, 600);
    }

    // Atualizar pontuação
    document.getElementById('pontuacaoAtual').textContent = pontosTotal;
    var percentualBarra = (pontosTotal / 70) * 100;
    document.getElementById('barraVertical').style.height = percentualBarra + '%';

    var textoMissao = document.getElementById('textoMissao');
    if (textoMissao) {
        if (pontos === 10) {
            textoMissao.textContent = 'Excelente! Escolha altamente sustentavel!';
        } else if (pontos === 5) {
            textoMissao.textContent = 'Boa escolha, mas ainda existe uma opcao mais verde.';
        } else {
            textoMissao.textContent = 'Impacto baixo. Tente pensar no longo prazo!';
        }
    }

    setTimeout(function() {
        carregarCategoria(indiceCategoria + 1);
    }, 500);
}

/* ============================================
   FUNÇÃO: CALCULAR RESULTADO FINAL
   ============================================ */

function calcularResultadoFinal() {
    pararTemporizador();

    var percentual = Math.round((pontosTotal / 70) * 100);
    
    document.getElementById('pontosFinal').textContent = pontosTotal;
    document.getElementById('percentualFinal').textContent = percentual + '%';

    var mensagem = '';
    var icone = '';

    if (pontosTotal >= 63) {
        mensagem = '🏆 CAMPEÃO DA SUSTENTABILIDADE 🏆';
        icone = '🌟';
    } else if (pontosTotal >= 49) {
        mensagem = '🌈 HERÓI AMBIENTAL 🌈';
        icone = '💚';
    } else if (pontosTotal >= 35) {
        mensagem = '🌱 GUARDIÃO DO PLANETA 🌱';
        icone = '🌿';
    } else if (pontosTotal >= 21) {
        mensagem = '🌍 APRENDIZ SUSTENTÁVEL 🌍';
        icone = '🎯';
    } else {
        mensagem = '🚀 COMECE SUA JORNADA 🚀';
        icone = '✨';
    }

    document.getElementById('mensagemPrincipal').textContent = mensagem + ', ' + nomeJogador + '!';
    document.getElementById('iconeResultado').textContent = icone;
    document.getElementById('mensagemResultado').textContent = gerarMensagem(pontosTotal);

    gerarDicas();
    gerarBadges(pontosTotal);

    mudarTela('telaResultado');
}

/* ============================================
   FUNÇÃO: GERAR MENSAGEM
   ============================================ */

function gerarMensagem(pontos) {
    if (pontos >= 63) {
        return 'Você transformou sua escola em um paraíso sustentável! Todos devem copiar suas ideias! 🌟';
    } else if (pontos >= 49) {
        return 'Parabéns! Você criou uma escola muito mais verde e saudável! Continue assim! 💚';
    } else if (pontos >= 35) {
        return 'Muito bom! Você fez escolhas sábias para o planeta. Pode melhorar ainda mais! 🌱';
    } else if (pontos >= 21) {
        return 'Bom começo! Você começou a entender a importância da sustentabilidade! 🌍';
    } else {
        return 'Tudo bem! Agora você conhece melhor como ajudar o planeta. Vamos tentar novamente! 🚀';
    }
}

/* ============================================
   FUNÇÃO: GERAR DICAS
   ============================================ */

function gerarDicas() {
    var dicasHTML = '<h3>💡 Dicas para Melhorar:</h3><ul>';
    var temDica = false;

    if (pontuacaoPorCategoria['reciclagem'] < 10) {
        dicasHTML += '<li><strong>♻️ Reciclagem Inteligente:</strong> Implante a <strong>Coleta Seletiva</strong> com lixeiras separadas por tipo de material!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['energia'] < 10) {
        dicasHTML += '<li><strong>⚡ Energia Limpa:</strong> Coloque <strong>Painéis Solares</strong> no telhado da escola para aproveitar a energia do sol!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['agua'] < 10) {
        dicasHTML += '<li><strong>💧 Água Consciente:</strong> Instale um sistema de <strong>Coleta de Chuva</strong> para reutilizar a água!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['verde'] < 10) {
        dicasHTML += '<li><strong>🌱 Biodiversidade:</strong> Crie um <strong>Jardim Biodiverso</strong> com várias plantas e flores atrativas a borboletas!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['transporte'] < 10) {
        dicasHTML += '<li><strong>🚌 Transportes Verdes:</strong> Incentive <strong>Bicicletas e Caminhada</strong> para reduzir emissões de carbono!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['comida'] < 10) {
        dicasHTML += '<li><strong>🥗 Alimentação Saudável:</strong> Crie uma <strong>Horta Orgânica</strong> na escola para plantar comida fresca!</li>';
        temDica = true;
    }
    if (pontuacaoPorCategoria['consciencia'] < 10) {
        dicasHTML += '<li><strong>📢 Consciência Ambiental:</strong> Organize <strong>Campanhas e Palestras</strong> para conscientizar todos sobre sustentabilidade!</li>';
        temDica = true;
    }

    dicasHTML += '</ul>';

    if (pontosTotal === 70) {
        dicasHTML = '<h3>✅ PERFEIÇÃO!</h3><p style="color: #10b981; font-weight: 600;">Você escolheu TODAS as opções mais sustentáveis! Você é um verdadeiro herói! 🦸‍♂️</p>';
    }

    document.getElementById('dicasResultado').innerHTML = dicasHTML;
}

/* ============================================
   FUNÇÃO: GERAR BADGES
   ============================================ */

function gerarBadges(pontos) {
    var badgesHTML = '<h3>🏅 Suas Conquistas:</h3><div class="badges-grid">';

    if (pontuacaoPorCategoria['reciclagem'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">♻️</div><p>Mestre da Reciclagem</p></div>';
    }
    if (pontuacaoPorCategoria['energia'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">☀️</div><p>Especialista em Energia</p></div>';
    }
    if (pontuacaoPorCategoria['agua'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">💧</div><p>Guardião da Água</p></div>';
    }
    if (pontuacaoPorCategoria['verde'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">🦋</div><p>Amigo da Natureza</p></div>';
    }
    if (pontuacaoPorCategoria['transporte'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">🚴</div><p>Ciclista Sustentável</p></div>';
    }
    if (pontuacaoPorCategoria['comida'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">🌽</div><p>Chef Orgânico</p></div>';
    }
    if (pontuacaoPorCategoria['consciencia'] === 10) {
        badgesHTML += '<div class="badge-item"><div class="badge">🎤</div><p>Ativista Ambiental</p></div>';
    }
    if (pontosTotal === 70) {
        badgesHTML += '<div class="badge-item"><div class="badge">👑</div><p>Rei/Rainha Sustentável</p></div>';
    }

    badgesHTML += '</div>';

    document.getElementById('badgesResultado').innerHTML = badgesHTML;
}

/* ============================================
   FUNÇÃO: IR PARA FORMULÁRIO
   ============================================ */

function irParaFormulario() {
    mudarTela('telaFormulario');
}

/* ============================================
   FUNÇÃO: FINALIZAR O JOGO
   ============================================ */

function finalizarJogo() {
    var resposta1 = document.getElementById('pergunta1').value;
    var resposta2 = document.getElementById('pergunta2').value.trim();
    var resposta3 = document.getElementById('pergunta3').value.trim();

    if (resposta1 === '' || resposta2 === '' || resposta3 === '') {
        alert('Por favor, responda todas as perguntas!');
        return;
    }

    var rankingSalvo = salvarNoRanking();
    if (!rankingSalvo) {
        alert('Nao foi possivel salvar no ranking deste navegador, mas sua conclusao foi registrada na tela.');
    }

    mudarTela('telaConclusao');
}

/* ============================================
   FUNÇÃO: SALVAR NO RANKING
   ============================================ */

function salvarNoRanking() {
    var ranking = obterRankingSalvo();

    var jogador = {
        nome: normalizarTexto(nomeJogador, 'Jogador', 80),
        turma: normalizarTexto(turmaJogador, 'Turma nao informada', 50),
        pontos: pontosTotal,
        data: new Date().toLocaleDateString('pt-BR')
    };

    ranking.push(jogador);
    ranking.sort(function(a, b) {
        return b.pontos - a.pontos;
    });

    try {
        localStorage.setItem('rankingEscolaSustentavel', JSON.stringify(ranking));
        return true;
    } catch (erro) {
        return false;
    }
}

/* ============================================
   FUNÇÃO: MOSTRAR RANKING
   ============================================ */

function mostrarRanking() {
    var ranking = obterRankingSalvo();

    preencherListaRanking(ranking);
    mudarTela('telaRanking');
}

/* ============================================
   FUNÇÃO: PREENCHER RANKING
   ============================================ */

function preencherListaRanking(ranking) {
    var listaRanking = document.getElementById('listaRanking');
    listaRanking.innerHTML = '';

    if (ranking.length === 0) {
        var mensagemVazia = document.createElement('p');
        mensagemVazia.className = 'vazio';
        mensagemVazia.textContent = 'Nenhum herói ainda. Seja o primeiro! 🚀';
        listaRanking.appendChild(mensagemVazia);
        return;
    }

    var i = 0;
    while (i < ranking.length) {
        var jogador = ranking[i];
        var posicao = i + 1;

        var classeMedal = '';
        var medalha = '';
        if (posicao === 1) {
            classeMedal = 'ouro';
            medalha = '🥇 ';
        } else if (posicao === 2) {
            classeMedal = 'prata';
            medalha = '🥈 ';
        } else if (posicao === 3) {
            classeMedal = 'bronze';
            medalha = '🥉 ';
        }

        var elementoJogador = document.createElement('div');
        elementoJogador.className = 'item-ranking ' + classeMedal;

        var blocoPosicao = document.createElement('div');
        var textoPosicao = document.createElement('div');
        textoPosicao.className = 'posicao';
        textoPosicao.textContent = medalha + posicao + 'º';
        blocoPosicao.appendChild(textoPosicao);

        var detalhesJogador = document.createElement('div');
        detalhesJogador.className = 'detalhes-jogador';

        var nome = document.createElement('p');
        nome.className = 'nome-jogador';
        nome.textContent = jogador.nome;

        var turma = document.createElement('p');
        turma.className = 'turma-jogador';
        turma.textContent = jogador.turma;

        detalhesJogador.appendChild(nome);
        detalhesJogador.appendChild(turma);

        var pontos = document.createElement('div');
        pontos.className = 'pontos-ranking';
        pontos.textContent = jogador.pontos + ' pts';

        elementoJogador.appendChild(blocoPosicao);
        elementoJogador.appendChild(detalhesJogador);
        elementoJogador.appendChild(pontos);

        listaRanking.appendChild(elementoJogador);
        i++;
    }
}

/* ============================================
   FUNÇÃO: MUDAR TELA
   ============================================ */

function mudarTela(nomeTela) {
    pararTemporizador();

    var todasAsTelas = document.querySelectorAll('.tela');
    var i = 0;
    while (i < todasAsTelas.length) {
        todasAsTelas[i].classList.remove('ativa');
        i++;
    }

    var telaSelecionada = document.getElementById(nomeTela);
    if (telaSelecionada) {
        telaSelecionada.classList.add('ativa');
    }

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
}

/* ============================================
   FUNÇÃO: VOLTAR PARA INÍCIO
   ============================================ */

function voltarParaInicio() {
    pararTemporizador();

    document.getElementById('inputNome').value = '';
    document.getElementById('inputTurma').value = '';
    document.getElementById('pergunta1').value = '';
    document.getElementById('pergunta2').value = '';
    document.getElementById('pergunta3').value = '';

    mudarTela('telaInicio');
}

/* ============================================
   FUNÇÃO: MOSTRAR INSTRUÇÕES
   ============================================ */

function mostrarInstrucoes() {
    mudarTela('telaInstruções');
}

/* ============================================
   INICIALIZAÇÃO
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    mudarTela('telaInicio');
});
