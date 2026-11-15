# Forno & Pizza

Website de uma pizzaria com menu, encomendas e um configurador "Monta a Tua Pizza", onde o cliente escolhe a massa, o tamanho e os ingredientes e o preço é calculado à sua medida.

Projeto da unidade curricular de **Aplicações Web** (ISCAC, Licenciatura em Informática de Gestão, 2026/2027).

**Autores:** Diogo Vinhais e Ricardo Meca

## Estado do projeto

| Entrega | Conteúdo | Estado |
|---------|----------|--------|
| 1 | Identificação do projeto e esquemas (mockups) | Entregue |
| 2 | Estrutura e responsividade (HTML e CSS) | Esta versão |
| 3 | Interatividade e dados | Em desenvolvimento (carrinho e cálculo do preço já em JavaScript) |

## Páginas

- `index.html` — página inicial (destaques, promoção e horário)
- `menu.html` — pizzas, bebidas e sobremesas
- `monta.html` — configurador "Monta a Tua Pizza"
- `sobre.html` — história e valores da pizzaria
- `encomendas.html` — resumo do carrinho, entrega e pagamento
- `contactos.html` — informações e formulário de contacto

## Estrutura do repositório

```
├── index.html
├── menu.html
├── monta.html
├── sobre.html
├── encomendas.html
├── contactos.html
├── css/
│   └── estilo.css
├── js/
│   └── script.js
├── img/
│   ├── logo-icone.webp
│   ├── pizza-*.svg
│   └── ing-*.svg
├── assets/          (logótipo original)
└── docs/            (esquemas da Entrega 1: .drawio e .png)
```

## Como ver o site

Abrir o ficheiro `index.html` num browser.

## Notas

- Desenvolvido com a abordagem **mobile first** (estilos base para telemóvel e `@media (min-width: ...)` para ecrãs maiores).
- JavaScript simples (sem bibliotecas): carrinho guardado no `localStorage`, cálculo do preço no "Monta a Tua Pizza", checkout simulado e mensagem de contacto. A base de dados fica para a próxima entrega.
- As imagens das pizzas são ilustrações em SVG (leves e escaláveis).
