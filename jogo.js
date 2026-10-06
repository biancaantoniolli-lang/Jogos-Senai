// =====================================================
// 1. CONFIGURAÇÃO DO CANVAS
// =====================================================

// Pegamos o canvas pelo ID.
const canvas = document.getElementById("jogo");

// Criamos o sistema de desenho 2D.
const ctx = canvas.getContext("2d");


// =====================================================
// 2. CHÃO
// =====================================================

const chaoY = 250;


// =====================================================
// 3. DINOSSAURO
// =====================================================

const dinossauro = {

    x: 100,

    y: 190,

    largura: 50,

    altura: 60,

    // Velocidade vertical usada no pulo.
    velocidadeY: 0,

    // Diz se o dinossauro está no chão.
    noChao: true
};


// =====================================================
// 4. FÍSICA DO PULO
// =====================================================

// Gravidade.
const gravidade = 0.7;

// Força do pulo.
const forcaPulo = -13;


// =====================================================
// 5. CACTOS
// =====================================================

// Lista que guarda todos os cactos.
let cactos = [];

// Velocidade inicial dos cactos.
const velocidadeInicial = 5;

// Velocidade atual dos cactos.
let velocidadeCacto = velocidadeInicial;

// Velocidade máxima.
// Isso evita que o jogo fique impossível.
const velocidadeMaxima = 8;

// Contador para controlar o aparecimento dos cactos.
let contadorCacto = 0;


// =====================================================
// 6. PONTUAÇÃO
// =====================================================

// Pontuação atual.
let pontuacao = 0;

// Conta os frames para aumentar a pontuação.
let contadorPontuacao = 0;


// =====================================================
// 7. RECORDE
// =====================================================

// Pegamos o recorde que está salvo no navegador.
//
// Se ainda não existir um recorde salvo,
// usamos 0.
let recorde = Number(localStorage.getItem("recordeDino")) || 0;


// =====================================================
// 8. CONTROLE DO JOGO
// =====================================================

// Indica se o jogador perdeu.
let jogoTerminou = false;


// =====================================================
// 9. DESENHAR O CHÃO
// =====================================================

function desenharChao() {

    ctx.strokeStyle = "#333333";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, chaoY);

    ctx.lineTo(canvas.width, chaoY);

    ctx.stroke();
}


// =====================================================
// 10. DESENHAR O DINOSSAURO
// =====================================================

function desenharDinossauro() {

    // Cor do dinossauro.
    ctx.fillStyle = "#333333";


    // -----------------------------
    // Corpo
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 10,
        dinossauro.y + 20,
        30,
        30
    );


    // -----------------------------
    // Cabeça
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 25,
        dinossauro.y,
        25,
        30
    );


    // -----------------------------
    // Focinho
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 45,
        dinossauro.y + 10,
        15,
        12
    );


    // -----------------------------
    // Pescoço
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 25,
        dinossauro.y + 15,
        15,
        25
    );


    // -----------------------------
    // Cauda
    // -----------------------------

    ctx.fillRect(
        dinossauro.x,
        dinossauro.y + 25,
        15,
        8
    );

    ctx.fillRect(
        dinossauro.x - 8,
        dinossauro.y + 30,
        12,
        7
    );


    // -----------------------------
    // Perna esquerda
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 15,
        dinossauro.y + 45,
        8,
        15
    );


    // -----------------------------
    // Perna direita
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 32,
        dinossauro.y + 45,
        8,
        15
    );


    // -----------------------------
    // Braço
    // -----------------------------

    ctx.fillRect(
        dinossauro.x + 38,
        dinossauro.y + 28,
        12,
        6
    );


    // -----------------------------
    // Olho
    // -----------------------------

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        dinossauro.x + 42,
        dinossauro.y + 6,
        5,
        5
    );
}


// =====================================================
// 11. CRIAR CACTO
// =====================================================

function criarCacto() {

    // Escolhe uma altura aleatória.
    const altura =
        Math.floor(Math.random() * 41) + 30;

    // Escolhe uma largura aleatória.
    const largura =
        Math.floor(Math.random() * 11) + 10;


    // Cria o cacto.
    const novoCacto = {

        // Começa fora do lado direito da tela.
        x: canvas.width + 20,

        // Fica apoiado no chão.
        y: chaoY - altura,

        largura: largura,

        altura: altura
    };


    // Adiciona o cacto à lista.
    cactos.push(novoCacto);
}


// =====================================================
// 12. DESENHAR OS CACTOS
// =====================================================

function desenharCactos() {

    // Cor dos cactos.
    ctx.fillStyle = "#16821a";


    // Percorre todos os cactos.
    for (let cacto of cactos) {

        // Corpo principal.
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );


        // -----------------------------
        // Braço esquerdo
        // -----------------------------

        if (cacto.altura >= 45) {

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 20,
                8,
                7
            );

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 13,
                7,
                14
            );
        }


        // -----------------------------
        // Braço direito
        // -----------------------------

        if (cacto.altura >= 55) {

            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 30,
                8,
                7
            );

            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 23,
                7,
                14
            );
        }
    }
}


// =====================================================
// 13. ATUALIZAR OS CACTOS
// =====================================================

function atualizarCactos() {

    // Move todos os cactos para a esquerda.
    for (let cacto of cactos) {

        cacto.x -= velocidadeCacto;
    }


    // Remove os cactos que saíram da tela.
    for (let i = cactos.length - 1; i >= 0; i--) {

        if (cactos[i].x + cactos[i].largura < 0) {

            cactos.splice(i, 1);
        }
    }


    // Diminui o contador.
    contadorCacto--;


    // Quando chegar a zero, cria outro cacto.
    if (contadorCacto <= 0) {

        criarCacto();

        // Intervalo aleatório entre os cactos.
        contadorCacto =
            Math.floor(Math.random() * 91) + 70;
    }
}


// =====================================================
// 14. ATUALIZAR A PONTUAÇÃO
// =====================================================

function atualizarPontuacao() {

    // Aumenta o contador.
    contadorPontuacao++;


    // A cada 6 frames, ganha 1 ponto.
    if (contadorPontuacao >= 6) {

        pontuacao++;

        contadorPontuacao = 0;
    }


    // =================================================
    // VERIFICAR O RECORDE
    // =================================================

    // Se a pontuação atual passou do recorde...
    if (pontuacao > recorde) {

        // A pontuação vira o novo recorde.
        recorde = pontuacao;

        // Salva o novo recorde no navegador.
        localStorage.setItem(
            "recordeDino",
            recorde
        );
    }


    // =================================================
    // AUMENTAR A VELOCIDADE
    // =================================================

    // Descobre quantos grupos de 100 pontos
    // já foram alcançados.
    const nivelVelocidade =
        Math.floor(pontuacao / 100);

    // Aumenta 0.5 na velocidade a cada 100 pontos.
    velocidadeCacto =
        velocidadeInicial +
        (nivelVelocidade * 0.5);


    // Impede a velocidade de passar do limite.
    if (velocidadeCacto > velocidadeMaxima) {

        velocidadeCacto = velocidadeMaxima;
    }
}


// =====================================================
// 15. MOSTRAR PONTUAÇÃO E RECORDE
// =====================================================

function desenharPontuacao() {

    // -----------------------------------------------
    // FORMATAR A PONTUAÇÃO
    // -----------------------------------------------

    let textoPontuacao =
        pontuacao.toString();


    // Adiciona zeros até ter 5 dígitos.
    while (textoPontuacao.length < 5) {

        textoPontuacao =
            "0" + textoPontuacao;
    }


    // -----------------------------------------------
    // FORMATAR O RECORDE
    // -----------------------------------------------

    let textoRecorde =
        recorde.toString();


    // Adiciona zeros até ter 5 dígitos.
    while (textoRecorde.length < 5) {

        textoRecorde =
            "0" + textoRecorde;
    }


    // -----------------------------------------------
    // DESENHAR NA TELA
    // -----------------------------------------------

    ctx.fillStyle = "#333333";

    ctx.font = "20px Arial";

    // Alinha os textos à direita.
    ctx.textAlign = "right";


    // Desenha a pontuação.
    ctx.fillText(
        textoPontuacao,
        canvas.width - 20,
        30
    );


    // Desenha o recorde ao lado da pontuação.
    ctx.fillText(
        "HI " + textoRecorde,
        canvas.width - 100,
        30
    );


    // Volta o alinhamento para o padrão.
    ctx.textAlign = "left";
}


// =====================================================
// 16. FAZER O DINOSSAURO PULAR
// =====================================================

function pular() {

    // Só pode pular se estiver no chão.
    if (dinossauro.noChao) {

        dinossauro.velocidadeY = forcaPulo;

        dinossauro.noChao = false;
    }
}


// =====================================================
// 17. ATUALIZAR O DINOSSAURO
// =====================================================

function atualizarDinossauro() {

    // Aplica a gravidade.
    dinossauro.velocidadeY += gravidade;

    // Atualiza a posição vertical.
    dinossauro.y += dinossauro.velocidadeY;


    // Verifica se chegou ao chão.
    if (dinossauro.y + dinossauro.altura >= chaoY) {

        // Coloca o dinossauro no chão.
        dinossauro.y =
            chaoY - dinossauro.altura;

        // Para a queda.
        dinossauro.velocidadeY = 0;

        // Diz que está no chão.
        dinossauro.noChao = true;
    }
}


// =====================================================
// 18. VERIFICAR COLISÃO
// =====================================================

function verificarColisao() {

    // Percorre todos os cactos.
    for (let cacto of cactos) {

        /*
         * Comparamos as caixas invisíveis
         * do dinossauro e do cacto.
         */

        const bateu =
            dinossauro.x < cacto.x + cacto.largura &&
            dinossauro.x + dinossauro.largura > cacto.x &&
            dinossauro.y < cacto.y + cacto.altura &&
            dinossauro.y + dinossauro.altura > cacto.y;


        // Se houve colisão...
        if (bateu) {

            jogoTerminou = true;

            return;
        }
    }
}


// =====================================================
// 19. DESENHAR GAME OVER
// =====================================================

function desenharGameOver() {

    ctx.fillStyle = "#333333";

    ctx.font = "bold 42px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        130
    );


    ctx.font = "18px Arial";

    ctx.fillText(
        "Aperte espaço para o jogo começar de novo",
        canvas.width / 2,
        170
    );


    ctx.textAlign = "left";
}


// =====================================================
// 20. REINICIAR O JOGO
// =====================================================

function reiniciarJogo() {

    // Volta o dinossauro para o começo.
    dinossauro.x = 100;

    dinossauro.y =
        chaoY - dinossauro.altura;

    // Zera a velocidade vertical.
    dinossauro.velocidadeY = 0;

    // Coloca no chão.
    dinossauro.noChao = true;


    // Remove todos os cactos.
    cactos = [];


    // Reinicia o contador dos cactos.
    contadorCacto = 70;


    // -----------------------------------------------
    // REINICIAR PONTUAÇÃO
    // -----------------------------------------------

    pontuacao = 0;

    contadorPontuacao = 0;


    // -----------------------------------------------
    // REINICIAR VELOCIDADE
    // -----------------------------------------------

    velocidadeCacto = velocidadeInicial;


    // -----------------------------------------------
    // CONTINUAR O JOGO
    // -----------------------------------------------

    jogoTerminou = false;
}


// =====================================================
// 21. TECLADO
// =====================================================

document.addEventListener("keydown", function(event) {

    // Espaço.
    if (event.code === "Space") {

        // Impede a página de rolar.
        event.preventDefault();


        // Se o jogo terminou...
        if (jogoTerminou) {

            // Reinicia a partida.
            reiniciarJogo();

            return;
        }


        // Durante o jogo, espaço faz o dinossauro pular.
        pular();
    }


    // Seta para cima.
    if (event.code === "ArrowUp") {

        event.preventDefault();


        // Só pula se o jogo estiver funcionando.
        if (!jogoTerminou) {

            pular();
        }
    }
});


// =====================================================
// 22. LIMPAR A TELA
// =====================================================

function limparTela() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// =====================================================
// 23. LOOP PRINCIPAL DO JOGO
// =====================================================

function jogo() {

    // Limpa a tela.
    limparTela();


    // -------------------------------------------------
    // SE O JOGO ESTIVER FUNCIONANDO
    // -------------------------------------------------

    if (!jogoTerminou) {

        // Atualiza o dinossauro.
        atualizarDinossauro();

        // Atualiza os cactos.
        atualizarCactos();

        // Atualiza a pontuação.
        atualizarPontuacao();

        // Verifica colisões.
        verificarColisao();
    }


    // -------------------------------------------------
    // DESENHAR ELEMENTOS
    // -------------------------------------------------

    // Desenha o chão.
    desenharChao();

    // Desenha os cactos.
    desenharCactos();

    // Desenha o dinossauro.
    desenharDinossauro();

    // Desenha pontuação e recorde.
    desenharPontuacao();


    // -------------------------------------------------
    // GAME OVER
    // -------------------------------------------------

    if (jogoTerminou) {

        desenharGameOver();
    }


    // Continua o loop.
    requestAnimationFrame(jogo);
}


// =====================================================
// 24. INICIAR O JOGO
// =====================================================

jogo();