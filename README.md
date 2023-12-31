<p align="center">
  <img src="./crash-gambling.gif" width="630" height="355"/>
</p>

# crash-royal-rush

Este é um projeto de desenvolvimento de um jogo de Crash de Cassino totalmente em JavaScript. O jogo é uma representação virtual do popular jogo de cassino "Crash", onde os jogadores apostam em um gráfico de aumento de valor e tentam sair antes que ele "crashe".

## Implementação do Jogo

O jogo de Crash de Cassino foi desenvolvido principalmente com JavaScript para manipulação da lógica do jogo em tempo real. A renderização visual do jogo é feita na tag `<canvas>` do HTML, permitindo uma experiência de jogo envolvente.

### Lógica do Jogo

A lógica do jogo é implementada em JavaScript, e o Gráfico de Aumento de Valor é gerado aleatoriamente e, conforme o jogo progride, o valor aumenta de forma dinâmica. Isso é feito usando funções JavaScript para atualizar o valor do gráfico em intervalos regulares.

### Renderização na Tag `<canvas>`

A tag `<canvas>` do HTML é usada para renderizar visualmente o jogo na interface do usuário. Aqui está como a renderização é tratada:

-   **Contexto do Canvas:** Um contexto 2D é obtido a partir do elemento `<canvas>`, permitindo o desenho e a atualização da tela usando JavaScript.

-   **Atualização Contínua:** O contexto do canvas é atualizado continuamente para refletir o estado atual do jogo. Isso inclui a renderização do gráfico de aumento de valor em tempo real.

## Tecnologias Utilizadas

-   **JavaScript:** A linguagem principal de programação usada para desenvolver a lógica do jogo.

-   **HTML/CSS:** Utilizados para criar a interface do jogo.

-   **WebSocket:** Faz a comunicação entre a aplicação e o [backend do Royal Rush](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-2-ti5-5104100-royal-rush).

## Como Adicionar em outras páginas

Para adicionar o jogo no site, uma das formas é utilziar a tag `iframe` do html que é utilizada para inserir conteúdos externos em uma página. Segue abaixo um exemplo de uso:

```html
<iframe width="100" height="533" src="https://crash-royal-rush.onrender.com"></iframe>
```

em que o `width` e `height` correspondem ao tamanho desejado do `canvas` e o `src` é a url da aplicação a ser espelhada.

## Como Abrir o Jogo

É possível acessar o jogo através [deste link](https://crash-royal-rush.onrender.com)
