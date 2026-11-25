# Jogo Escolar

Jogo educativo em HTML, CSS e JavaScript para ensinar sustentabilidade de forma interativa. O jogador monta uma escola mais ecologica tomando decisoes sobre reciclagem, energia, agua, biodiversidade, transporte, alimentacao e conscientizacao ambiental.

## Como funciona

O jogo apresenta desafios em rodadas. Em cada categoria, o jogador escolhe uma opcao com impacto ambiental diferente e recebe uma pontuacao. No final, o sistema exibe resultado, dicas de melhoria, conquistas e ranking local.

## Recursos

- Entrada com nome e turma do jogador.
- Sete categorias de sustentabilidade.
- Temporizador por rodada.
- Pontuacao total ate 70 pontos.
- Feedback de acordo com as escolhas.
- Badges/conquistas por categoria.
- Ranking salvo no `localStorage` do navegador.
- Layout visual e responsivo para uso em atividade escolar.

## Stack

- HTML5
- CSS3
- JavaScript puro
- `localStorage` para ranking local

## Estrutura

```text
.
└── Escola-Sustentável/
    ├── Jogo-Meio-Ambiente.html
    ├── style.css
    ├── script.js
    └── favicon.svg
```

## Como rodar

Abra o arquivo abaixo no navegador:

```text
Escola-Sustentável/Jogo-Meio-Ambiente.html
```

Tambem e possivel usar uma extensao como Live Server no VS Code.

## Status

Projeto front-end concluido para atividade escolar, sem necessidade de backend.

## Fluxo e persistência

`Escola-Sustentável/script.js` controla rodadas, opções, temporizador, pontuação e resultado; `style.css` apresenta a estrutura de `Jogo-Meio-Ambiente.html`. O ranking fica no navegador: não há servidor, conta ou ranking global; o visitante pode alterar os dados locais.

Não há dependências npm, build, `.env`, banco ou migrations. Outra opção para executar é servir `Escola-Sustentável` com servidor estático local.

## Testes e evolução

Não há suíte automatizada ou deploy confirmado. Foram inspecionados código/regras, sem atribuir testes funcionais à revisão. Prioridades: pontuação/temporizador, teclado e reinício de partida. Não há licença versionada. Demonstra lógica de interface/educação ambiental, sem backend.
