# 🎬 Catálogo de Filmes

Aplicação front-end desenvolvida em React que consome a API pública do [TheMovieDB (TMDB)](https://www.themoviedb.org/documentation/api) para exibir filmes populares, lançamentos e permitir busca e visualização de detalhes.

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um teste técnico, com o objetivo de demonstrar boas práticas de desenvolvimento front-end com React, organização de código, componentização e consumo de API externa.

## Funcionalidades

- **Lançamentos** — banner com autoplay (pausa no hover) e indicadores (dots), consumindo `GET /movie/upcoming`.
- **Populares**, **Melhores Avaliados** e **Filmes Nacionais** — carrosséis horizontais (setas ou arrastando manualmente), consumindo `GET /movie/popular`, `GET /movie/top_rated` e `GET /discover/movie` (`region=BR`). Cada um mostra só a primeira página da TMDB (~20 filmes) — ver [Decisões técnicas](#decisões-técnicas) para entender por quê.
- **Busca** — campo de busca no topo que consulta `GET /search/movie`, lista os resultados em grid e pagina via `page` da própria TMDB (evita carregar tudo de uma vez e travar a tela).
- **Detalhes do filme** — poster, sinopse, nota, diretor, gêneros, data de lançamento e até 10 atores do elenco, consumindo `GET /movie/{id}` e `GET /movie/{id}/credits`. Acessível clicando em qualquer card (banner, populares ou busca).
- **Memória de scroll** — o botão "‹ Voltar" na tela de detalhes retorna para home ou para busca rolado exatamente onde você deixou (inclusive a posição horizontal de cada carrossel). Já clicar na logo para ir para home é um recomeço de verdade: limpa toda essa memória, então a home e os carrosséis voltam pro início.

- ### Diferenciais implementados

- [x] Paginação na listagem de filmes
- [x] Testes unitários
- [ ] Deploy (Vercel / Netlify / GitHub Pages)
- [x] State Management (Signals)
- [x] Lazy Loading e modularização
- [x] Interface responsiva
- [ ] Localização (Inglês e Português)
- [x] Filmes por região — não como filtro de busca (removido de lá em favor da busca combinada), mas para mostrar os filmes nacionais na home via `/discover/movie?region=BR`

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/) 19
- TypeScript
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [MUI](https://mui.com/)
- [Prettier](https://prettier.io/)
- [TheMovieDB API](https://developer.themoviedb.org/reference/intro/getting-started)
- `fetch` nativo para as chamadas à API (sem axios/react-query)

### Bibliotecas externas

| Biblioteca                               | Por que foi usada                                                                              | Benefícios trazidos                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [MUI](https://mui.com/)                  | Componentes de UI prontos e acessíveis (inputs, botões, ícones, paginação, loading)            | Agilidade no desenvolvimento sem reinventar componentes básicos                                                          |
| [Tailwind CSS](https://tailwindcss.com/) | Utilitários de layout, espaçamento e responsividade direto no JSX, sem escrever CSS repetitivo | Iteração rápida de UI (grids responsivos, carrosséis, skeletons de loading) com pouco código                             |
| [React Router](https://reactrouter.com/) | Navegação real entre telas (histórico do navegador, params, query strings)                     | Voltar/avançar nativos, URLs compartilháveis e com refresh, sem precisar de estado manual para saber "em que tela estou" |

## Pré-requisitos

- Node.js 20+
- Uma API Key do TMDB (v3 auth) — crie uma conta gratuita em [themoviedb.org](https://www.themoviedb.org/) e gere a chave em Configurações da conta > API.

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de variáveis de ambiente e informe sua chave da TMDB:

```bash
cp .env.example .env
```

```
VITE_TMDB_API_KEY=sua_api_key_aqui
```

## Rodando localmente

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Outros scripts

```bash
npm run build          # build de produção (tsc + vite build)
npm run lint           # oxlint
npm run format         # formata o projeto com prettier
npm run format:check   # verifica formatação sem alterar arquivos
npm test               # roda a suíte de testes uma vez (vitest run)
npm run test:watch     # roda os testes em modo watch
```

## Testes

[Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) + `jsdom`. Os testes ficam ao lado do arquivo testado (`Componente.test.tsx`), exceto os utilitários compartilhados em `src/test/` (`setup.ts` com os matchers do `jest-dom` e os polyfills que o `jsdom` não tem — `ResizeObserver`, `scrollTo`/`scrollBy`; e `factories.ts` com um `createMovie`/`createMovies` pra não repetir um objeto `Movie` inteiro em cada teste).

A cobertura foca na lógica que já quebrou pelo menos uma vez ao longo do desenvolvimento (ver [Decisões técnicas](#decisões-técnicas) — vários dos bugs documentados ali viraram teste de regressão), não em cobertura exaustiva de todo componente:

- `api/tmdb.ts` — parâmetros corretos por endpoint (idioma, `page`, `region`), e a ausência proposital de `language` em `/credits`.
- `ScrollMemoryProvider`/`useScrollMemory` — get/set/clear por chave.
- `useScrollRestoration` — só restaura com `isReady`, distingue "chave nova" (rola pro topo) de "chave já visitada" (restaura a posição), e salva a cada scroll.
- `SearchBar` — a regressão da digitação sendo desfeita a cada tecla, e a matriz de comportamento (limpa na home, sincroniza na busca, mantém nas outras telas).
- `MovieCarousel` — setas habilitando/desabilitando com base em `scrollWidth`/`clientWidth` mockados (o `jsdom` não faz layout de verdade, então as dimensões do container são simuladas via `Object.defineProperty`), restauração de posição ao montar.
- `MovieCard`, `SearchResults`, `UpcomingBanner` — renderização condicional (loading/erro/vazio), paginação, autoplay e pausa no hover (com `vi.useFakeTimers()`, escopado só aos testes que precisam — misturar timers falsos com `userEvent.click` trava o teste).

## Deploy

A aplicação está disponível no Vercel [neste link](https://btg-themovie-react.vercel.app/).

## Rotas

| Rota              | Página             | O que faz                                                                           |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `/`               | `HomePage`         | Lançamentos (banner) + carrosséis (Populares, Melhores Avaliados, Filmes Nacionais) |
| `/busca?q=&page=` | `SearchPage`       | Resultados da busca, `q` e `page` como query params                                 |
| `/filme/:id`      | `MovieDetailsPage` | Detalhes do filme (`id` da TMDB)                                                    |

Como funciona:

- `main.tsx` envolve tudo com `<BrowserRouter>`; `App.tsx` só declara os `<Route>` dentro de `<Routes>` e renderiza o `<Header>` fixo por fora (ele aparece em todas as rotas).
- Cada página busca os próprios dados (`HomePage`, `SearchPage`, `MovieDetailsPage` têm seu próprio `useEffect` chamando `src/api/tmdb.ts`) e navega para as outras com `useNavigate` (ex.: clicar num card chama `navigate(`/filme/${id}`)`).
- `SearchPage` lê/escreve `q` e `page` com `useSearchParams` — mudar de página na paginação ou pesquisar de novo só atualiza a URL, o componente reage à mudança.
- O único botão "‹ Voltar" do app fica na tela de detalhes (`MovieDetails`) e chama `navigate(-1)` — volta para página anterior (home ou busca) exatamente como estava. A logo "🎬 Catálogo" no `Header` é um `<Link to="/">`, sempre visível, que também leva para home, mas como um recomeço (ver a seção de memória de scroll).
- `SearchBar` usa `useLocation`/`useSearchParams` para decidir o que mostrar no campo: limpa ao chegar na home, sincroniza com o `q` da URL na tela de busca, e **mantém o texto como estava** em qualquer outra tela (ex.: ao entrar nos detalhes de um filme vindo da busca, o campo continua com o termo buscado).

## Estrutura

```
src/
├── api/
│   └── tmdb.ts             # fetch wrapper único para a TMDB (api_key, endpoints, URLs de imagem)
├── components/
│   ├── Header.tsx           # logo (link para "/") + busca, fixo no topo
│   ├── SearchBar.tsx        # input + botão "Buscar"
│   ├── SearchResults.tsx    # grid de resultados da busca + paginação
│   ├── UpcomingBanner.tsx   # banner de lançamentos com autoplay
│   ├── MovieCarousel.tsx    # carrossel horizontal genérico (Populares, Melhores Avaliados, Filmes Nacionais)
│   ├── MovieCard.tsx        # poster + título + nota, clicável
│   └── MovieDetails.tsx     # conteúdo da tela de detalhes (sinopse, elenco, etc.)
├── context/
│   ├── scrollMemoryContext.ts  # só o Context (sem componente) — Fast Refresh exige separação
│   └── ScrollMemoryProvider.tsx  # Provider — Map em memória + getScroll/setScroll/clear
├── hooks/
│   ├── useScrollMemory.ts       # acesso tipado ao ScrollMemoryContext (+ .test.tsx)
│   └── useScrollRestoration.ts  # restaura/memoriza o scroll vertical da página (+ .test.tsx)
├── pages/
│   ├── HomePage.tsx          # rota "/"
│   ├── SearchPage.tsx        # rota "/busca" — lê/escreve `q` e `page` na URL
│   └── MovieDetailsPage.tsx  # rota "/filme/:id"
├── test/
│   ├── setup.ts        # matchers do jest-dom + polyfills (ResizeObserver, scrollTo/scrollBy)
│   └── factories.ts    # createMovie/createMovies pros testes
├── theme/
│   └── theme.ts             # tema dark do MUI
├── types/
│   └── movie.ts             # tipos da resposta da TMDB
├── App.tsx                  # <Routes> + Header fixo + ScrollMemoryProvider
└── main.tsx                  # BrowserRouter + ThemeProvider
```

## Decisões técnicas

- **React Router para navegação** (em vez de estado manual). Rotas de verdade significam voltar/avançar do navegador funcionando de graça, links compartilháveis e refresh sem perder contexto — ver a seção [Rotas](#rotas) para os detalhes de como cada tela usa isso.
- **Um único client de API.** Nenhum componente monta URL nem lida com a `api_key` — tudo passa por `src/api/tmdb.ts`, que centraliza a chave (via variável de ambiente) e os endpoints.
- **Tailwind para layout, MUI para os componentes interativos** (input, botão, ícones, loading), seguindo a mesma divisão de responsabilidades usada na versão Angular do projeto.
- **Paginação da busca via `Pagination` do MUI.** Cada página busca só os ~20 resultados daquela página (`page` do TMDB), em vez de carregar tudo de uma vez — evita requisições longas e a tela travando com listas grandes.
- **Carrossel com scroll finito, não loop infinito — trade-off deliberado.** A primeira versão tentava um loop infinito de verdade (lista triplicada, detecção de proximidade da borda, pulo instantâneo de posição, `useLayoutEffect` para centralizar). Funcionava, mas cada ajuste de UX (corte de anel no hover, `scroll-snap`, responsividade, memória de posição) esbarrava nessa complexidade e virava um acerto frágil em cima do outro — código difícil de entender e de mudar sem quebrar algo. Voltamos pro scroll finito simples (como a versão original em Angular: dois botões chamando `container.scrollBy()`), abrindo mão do "nunca bate na ponta" em troca de um componente muito mais curto e fácil de manter. Cada clique nas setas ainda rola uma "tela" de cards (`container.clientWidth`), não um valor fixo em pixels.
- **Setas desabilitadas nas pontas.** Como o scroll agora é finito (faz sentido "acabar"), cada seta reflete se ainda dá para rolar naquela direção: `canScrollLeft`/`canScrollRight` comparam `scrollLeft` com `0` e com `scrollWidth - clientWidth`, recalculados a cada evento de `scroll` e de `resize` da janela (a lista de filmes já vem pronta antes do carrossel montar, então não precisa recalcular quando `movies` muda). O botão desabilitado usa `disabled:opacity-30` — sem depender de sobrescrever a cor forçada (`text-white!`), que teria conflito de especificidade com um `disabled:text-*` igualmente forçado.
- **`scroll-snap` no carrossel.** O container tem `snap-x snap-mandatory` e cada card `snap-start`, então o scroll (seja pelas setas, seja arrastando) sempre para com um poster inteiro visível — nunca corta um card na metade.
- **Anel de hover como `ring` normal (não `ring-inset`).** Um anel inset ficava escondido atrás do próprio poster/backdrop, que ocupa 100% do card.
- **`scroll-padding` no carrossel, não só `padding` visual.** O primeiro e o último card ficam exatamente na borda da área visível do scroll — o anel de hover que vaza 2px para fora cairia numa região fora do viewport (clipada pelo `overflow-x-auto`), não por falta de espaço. A correção é `scroll-px-2` (`scroll-padding-inline`), que desloca o próprio ponto de encaixe do snap para dentro — sobra uma faixa vazia e genuinamente visível antes/depois do card, onde o anel pode vazar sem ser cortado. O `p-2` (padding visual) reforça o mesmo efeito. O container principal também foi alargado (`max-w-6xl` → `max-w-7xl`) para dar mais espaço de sobra em telas grandes.
- **Layout responsivo.** O `Header` empilha a logo acima do campo de busca em telas pequenas (`flex-col` até `sm`, `flex-row` a partir daí). No carrossel, o container do scroll tem `min-w-0` — sem isso, um flex item com conteúdo largo pode forçar a linha inteira a estourar a largura da tela em vez de rolar internamente, empurrando as setas para fora da viewport no mobile. Os cards também encolhem um pouco em telas pequenas (`w-36` → `w-45` a partir de `sm`), e o banner de lançamentos muda de proporção conforme a tela (`aspect-4/3` no mobile → `aspect-video` no tablet → `aspect-21/9` em telas grandes) para não ficar baixo/espremido demais.
- **Memória de scroll via Context.** `ScrollMemoryProvider` (em `App.tsx`, por fora das `<Routes>` — não desmonta ao navegar) guarda um `Map<string, number>` em memória, sem depender de nenhuma lib. Dois usos:
  - **Scroll vertical da página** (`useScrollRestoration`, usado em `HomePage`, `SearchPage` e `MovieDetailsPage`): a chave é `page:${location.key}` — o `location.key` do React Router é único por entrada do histórico e se repete quando você volta para essa mesma entrada (é o mesmo mecanismo por trás do `<ScrollRestoration>` dos data routers). Isso separa naturalmente "navegação nova" (chave nunca vista → `getScroll` retorna `undefined` → rola pro topo) de "voltar" (chave já visitada → restaura a posição salva). A restauração só roda depois que os dados carregaram (`isReady`); em vez de tentar em loop com um número máximo de tentativas, um `ResizeObserver` observa `document.body` e só restaura quando a página realmente cresce o suficiente para conter a posição salva — com um `setTimeout` de 2s como rede de segurança, caso ela nunca chegue lá (ex.: menos resultados do que antes). Mesmo problema descrito no README da versão Angular, resolvido do mesmo jeito (reagindo a um evento real de layout em vez de um polling arbitrário).
  - **Scroll horizontal do carrossel** (dentro do próprio `MovieCarousel`, chave `carousel:${title}`): agora que o scroll é finito, é só o `scrollLeft` bruto mesmo — salvo a cada evento de `scroll` e restaurado com `container.scrollLeft = valorSalvo` num `useLayoutEffect` ao montar (roda depois do DOM atualizar mas antes do navegador pintar, então não há flash visível saltando de 0 até a posição salva). O banner de lançamentos (`UpcomingBanner`) não usa essa memória — o slide sempre volta a mostrar o primeiro filme ao remontar.
- **Paginação do carrossel: só a primeira página da TMDB, de propósito.** Cheguei a implementar carregamento incremental (buscar `page=2`, `page=3`... conforme o usuário rola perto do fim, até um teto de ~100 filmes) — funcionava, mas esbarrou em duas coisas: (1) a TMDB não tem cursor de paginação de verdade, só número de página fixo, então "carregar mais perto do fim" sempre depende de saber em que página exata parou; e (2) a memória de scroll guarda só a posição em pixels (`scrollLeft`), não quantas páginas tinham sido carregadas — voltar de um filme depois de ter rolado fundo (página 3, por exemplo) remontava o carrossel só com a página 1, e a posição salva não fazia mais sentido pro conteúdo disponível naquele momento. Resolver isso direito exigia guardar e restaurar também "quantas páginas carregar de novo antes de repor o scroll", o que não parecia valer a complexidade extra para esse projeto. Voltamos atrás: cada carrossel mostra só os ~20 resultados da primeira página — menos filmes para rolar, mas a volta para posição exata continua simples e confiável.
- **Botão "Voltar" só na tela de detalhes, logo limpa tudo.** São dois jeitos diferentes de "ir para home" e cada um se comporta diferente de propósito: o "‹ Voltar" de `MovieDetails` chama `navigate(-1)`, reaproveitando a memória de scroll já salva (`location.key` da entrada anterior é o mesmo de antes, então tudo restaura). Já a logo no `Header` chama `clear()` do `ScrollMemoryProvider` (que esvazia o `Map` inteiro) antes de navegar — um recomeço de verdade, sem herdar nenhuma posição salva, mesmo que a navegação para "/" também gerasse uma chave nova por conta própria (o `clear()` também some com a memória dos carrosséis, que não é por `location.key` e não seria limpa sozinha).
- **Campo de busca "lembra" o termo fora da tela de busca.** O valor do input não é mais "vazio sempre que a rota não é `/busca`" — ele só é limpo explicitamente ao chegar na home (`isHome`). Em qualquer outra tela (ex.: detalhes de um filme aberto a partir de um resultado de busca), o texto permanece como estava, já que o próprio `SearchBar` nunca desmonta (fica fora das `<Routes>`, dentro do `Header`) e simplesmente não mexe no `value` fora dos casos de "home" e "busca".
  - **Cuidado ao comparar para decidir se sincroniza:** a primeira versão comparava `value` (o que está digitado) direto com a URL a cada render — como digitar já dispara um re-render, a própria comparação desfazia a digitação letra por letra. A correção guarda a última "rota" já vista (`pathname + q`) e só sincroniza o campo quando essa chave muda de verdade (ou seja, por navegação, não por digitação).
- **`GET /movie/{id}/credits` sem `language`.** Diferente dos outros endpoints (que sempre pedem `pt-BR`), a busca de elenco/equipe técnica é feita sem parâmetro de idioma — pedir tradução aqui deixava alguns nomes de ator/diretor bagunçados. `tmdbFetch` aceita uma opção `{ localized: false }` só para esse caso.
- **`HomePage` monta os carrosséis a partir de uma lista (`carouselSections`)**, em vez de repetir `<MovieCarousel>` uma vez por seção — adicionar uma nova categoria na home (feito para "Melhores Avaliados") é só acrescentar `{ title, movies }` nessa lista.
- **Testes: `vi.mock` no `useScrollMemory` em vez do `ScrollMemoryProvider` real.** `MovieCarousel` e `useScrollRestoration` dependem do Context de memória de scroll, mas os testes deles mockam o módulo `useScrollMemory` inteiro (`getScroll`/`setScroll` viram `vi.fn()`) em vez de envolver tudo num `<ScrollMemoryProvider>` de verdade. Isso isola cada teste — o comportamento do Provider já tem seu próprio arquivo de teste — e facilita simular casos específicos (`mockGetScroll.mockReturnValue(120)`) sem precisar popular o Map de fora.
- **Environment:** por mais que não seja ideal e nem seguro, precisei deixar o .env commitado com a key da API, a fim de facilitar/agilizar os testes e o deploy no Vercel.
