# 🎬 Catálogo de Filmes (React)

Versão em React + TypeScript do catálogo de filmes que consome a API do [TMDB](https://developer.themoviedb.org/reference/intro/getting-started). Este README cobre apenas o que já foi implementado — o escopo está sendo construído aos poucos.

## O que já existe

- **Lançamentos** — banner com autoplay (pausa no hover) e indicadores (dots), consumindo `GET /movie/upcoming`.
- **Populares** e **Melhores Avaliados** — carrosséis horizontais com loop infinito (setas ou arrastando manualmente), consumindo `GET /movie/popular` e `GET /movie/top_rated`.
- **Busca** — campo de busca no topo que consulta `GET /search/movie`, lista os resultados em grid e pagina via `page` da própria TMDB (evita carregar tudo de uma vez e travar a tela).
- **Detalhes do filme** — poster, sinopse, nota, diretor, gêneros, data de lançamento e até 10 atores do elenco, consumindo `GET /movie/{id}` e `GET /movie/{id}/credits`. Acessível clicando em qualquer card (banner, populares ou busca).
- **Memória de scroll** — o botão "‹ Voltar" na tela de detalhes retorna pra home ou pra busca rolado exatamente onde você deixou (inclusive a posição horizontal de cada carrossel). Já clicar na logo pra ir pra home é um recomeço de verdade: limpa toda essa memória, então a home volta do topo e os carrosséis centralizados.

Ainda não implementado (fora do escopo atual): seções por gênero (ex.: Ação, Comédia via `/discover/movie?with_genres=`), testes.

## Stack

- [React](https://react.dev/) 19 + TypeScript, via [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) para as rotas (`/`, `/busca`, `/filme/:id`)
- [MUI](https://mui.com/) para componentes (inputs, botões, ícones, loading)
- [Tailwind CSS](https://tailwindcss.com/) 4 para layout e estilização
- `fetch` nativo para as chamadas à API (sem axios/react-query)
- [Prettier](https://prettier.io/) para formatação

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
```

## Rotas

| Rota              | Página             | O que faz                                                         |
| ----------------- | ------------------ | ----------------------------------------------------------------- |
| `/`               | `HomePage`         | Lançamentos (banner) + carrosséis (Populares, Melhores Avaliados) |
| `/busca?q=&page=` | `SearchPage`       | Resultados da busca, `q` e `page` como query params               |
| `/filme/:id`      | `MovieDetailsPage` | Detalhes do filme (`id` da TMDB)                                  |

Como funciona:

- `main.tsx` envolve tudo com `<BrowserRouter>`; `App.tsx` só declara os `<Route>` dentro de `<Routes>` e renderiza o `<Header>` fixo por fora (ele aparece em todas as rotas).
- Cada página busca os próprios dados (`HomePage`, `SearchPage`, `MovieDetailsPage` têm seu próprio `useEffect` chamando `src/api/tmdb.ts`) e navega para as outras com `useNavigate` (ex.: clicar num card chama `navigate(`/filme/${id}`)`).
- `SearchPage` lê/escreve `q` e `page` com `useSearchParams` — mudar de página na paginação ou pesquisar de novo só atualiza a URL, o componente reage à mudança.
- O único botão "‹ Voltar" do app fica na tela de detalhes (`MovieDetails`) e chama `navigate(-1)` — volta pra página anterior (home ou busca) exatamente como estava. A logo "🎬 Catálogo" no `Header` é um `<Link to="/">`, sempre visível, que também leva pra home, mas como um recomeço (ver a seção de memória de scroll).
- `SearchBar` usa `useLocation`/`useSearchParams` pra decidir o que mostrar no campo: limpa ao chegar na home, sincroniza com o `q` da URL na tela de busca, e **mantém o texto como estava** em qualquer outra tela (ex.: ao entrar nos detalhes de um filme vindo da busca, o campo continua com o termo buscado).

## Estrutura

```
src/
├── api/
│   └── tmdb.ts             # fetch wrapper único para a TMDB (api_key, endpoints, URLs de imagem)
├── components/
│   ├── Header.tsx           # logo (link pra "/") + busca, fixo no topo
│   ├── SearchBar.tsx        # input + botão "Buscar"
│   ├── SearchResults.tsx    # grid de resultados da busca + paginação
│   ├── UpcomingBanner.tsx   # banner de lançamentos com autoplay
│   ├── MovieCarousel.tsx    # carrossel horizontal genérico (Populares, Melhores Avaliados)
│   ├── MovieCard.tsx        # poster + título + nota, clicável
│   └── MovieDetails.tsx     # conteúdo da tela de detalhes (sinopse, elenco, etc.)
├── context/
│   ├── scrollMemoryContext.ts  # só o Context (sem componente) — Fast Refresh exige separação
│   └── ScrollMemoryProvider.tsx  # Provider — Map em memória + getScroll/setScroll/clear
├── hooks/
│   ├── useScrollMemory.ts       # acesso tipado ao ScrollMemoryContext
│   └── useScrollRestoration.ts  # restaura/memoriza o scroll vertical da página
├── pages/
│   ├── HomePage.tsx          # rota "/"
│   ├── SearchPage.tsx        # rota "/busca" — lê/escreve `q` e `page` na URL
│   └── MovieDetailsPage.tsx  # rota "/filme/:id"
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
- **Carrosséis (`MovieCarousel`) com loop infinito real.** A lista é renderizada triplicada (cópia antes + original + depois); ao chegar perto do início ou fim de uma cópia, o scroll pula instantaneamente (sem animação) para a posição equivalente na cópia do meio — tanto pelas setas quanto arrastando manualmente, nunca "trava" numa ponta. Mesma técnica usada na versão Angular do projeto.
- **`scroll-snap` no carrossel.** O container tem `snap-x snap-mandatory` e cada card `snap-start`, então o scroll (seja pelas setas, seja arrastando) sempre para com um poster inteiro visível — nunca corta um card na metade.
- **Anel de hover como `ring` normal (não `ring-inset`).** Um anel inset ficava escondido atrás do próprio poster/backdrop, que ocupa 100% do card.
- **`scroll-padding` no carrossel, não só `padding` visual.** Por causa do loop infinito, o carrossel nunca fica nas pontas reais do `scrollWidth` (sempre no "meio" da lista triplicada) — então um `padding` comum no container só ajudaria nas pontas, que na prática nunca são visitadas. O problema real: como cada card usa `scroll-snap-align: start`, o encaixe do scroll deixa a borda esquerda do card exatamente no limite da área visível, e o anel que vaza 2px pra fora cai numa região já "rolada pra trás" (fora do viewport, não é falta de espaço). A correção é `scroll-px-2` (`scroll-padding-inline`), que desloca o próprio ponto de encaixe do snap pra dentro — sobra uma faixa vazia e genuinamente visível antes do card, onde o anel pode vazar sem ser cortado, em qualquer posição do scroll. O `p-2` (padding visual) continua ali como reforço pras pontas reais da lista triplicada. O container principal também foi alargado (`max-w-6xl` → `max-w-7xl`) pra dar mais espaço de sobra em telas grandes.
- **Layout responsivo.** O `Header` empilha a logo acima do campo de busca em telas pequenas (`flex-col` até `sm`, `flex-row` a partir daí). No carrossel, o container do scroll tem `min-w-0` — sem isso, um flex item com conteúdo largo pode forçar a linha inteira a estourar a largura da tela em vez de rolar internamente, empurrando as setas pra fora da viewport no mobile. Os cards também encolhem um pouco em telas pequenas (`w-36` → `w-45` a partir de `sm`), e o banner de lançamentos muda de proporção conforme a tela (`aspect-4/3` no mobile → `aspect-video` no tablet → `aspect-21/9` em telas grandes) pra não ficar baixo/espremido demais.
- **Memória de scroll via Context.** `ScrollMemoryProvider` (em `App.tsx`, por fora das `<Routes>` — não desmonta ao navegar) guarda um `Map<string, number>` em memória, sem depender de nenhuma lib. Dois usos:
  - **Scroll vertical da página** (`useScrollRestoration`, usado em `HomePage`, `SearchPage` e `MovieDetailsPage`): a chave é `page:${location.key}` — o `location.key` do React Router é único por entrada do histórico e se repete quando você volta pra essa mesma entrada (é o mesmo mecanismo por trás do `<ScrollRestoration>` dos data routers). Isso separa naturalmente "navegação nova" (chave nunca vista → `getScroll` retorna `undefined` → rola pro topo) de "voltar" (chave já visitada → restaura a posição salva). A restauração só roda depois que os dados carregaram (`isReady`) e tenta de novo por até 20 frames até a página ficar alta o suficiente pra conter a posição salva — mesmo problema e mesma solução descritos no README da versão Angular.
  - **Scroll horizontal do carrossel** (dentro do próprio `MovieCarousel`, chave `carousel:${title}`): como o loop infinito sempre recentraliza no "conjunto do meio" da lista triplicada, o que é salvo não é o `scrollLeft` bruto (que muda a cada montagem), e sim o deslocamento relativo a esse centro (`scrollLeft - setWidth`). Ao remontar (voltando de um filme, por exemplo), a centralização inicial usa `setWidth + deslocamentoSalvo` em vez de só `setWidth`, então o carrossel volta pra onde estava.
- **Botão "Voltar" só na tela de detalhes, logo limpa tudo.** São dois jeitos diferentes de "ir pra home" e cada um se comporta diferente de propósito: o "‹ Voltar" de `MovieDetails` chama `navigate(-1)`, reaproveitando a memória de scroll já salva (`location.key` da entrada anterior é o mesmo de antes, então tudo restaura). Já a logo no `Header` chama `clear()` do `ScrollMemoryProvider` (que esvazia o `Map` inteiro) antes de navegar — um recomeço de verdade, sem herdar nenhuma posição salva, mesmo que a navegação para "/" também gerasse uma chave nova por conta própria (o `clear()` também some com a memória dos carrosséis, que não é por `location.key` e não seria limpa sozinha).
- **Campo de busca "lembra" o termo fora da tela de busca.** O valor do input não é mais "vazio sempre que a rota não é `/busca`" — ele só é limpo explicitamente ao chegar na home (`isHome`). Em qualquer outra tela (ex.: detalhes de um filme aberto a partir de um resultado de busca), o texto permanece como estava, já que o próprio `SearchBar` nunca desmonta (fica fora das `<Routes>`, dentro do `Header`) e simplesmente não mexe no `value` fora dos casos de "home" e "busca".
  - **Cuidado ao comparar pra decidir se sincroniza:** a primeira versão comparava `value` (o que está digitado) direto com a URL a cada render — como digitar já dispara um re-render, a própria comparação desfazia a digitação letra por letra. A correção guarda a última "rota" já vista (`pathname + q`) e só sincroniza o campo quando essa chave muda de verdade (ou seja, por navegação, não por digitação).
- **`GET /movie/{id}/credits` sem `language`.** Diferente dos outros endpoints (que sempre pedem `pt-BR`), a busca de elenco/equipe técnica é feita sem parâmetro de idioma — pedir tradução aqui deixava alguns nomes de ator/diretor bagunçados. `tmdbFetch` aceita uma opção `{ localized: false }` só pra esse caso.
- **`HomePage` monta os carrosséis a partir de uma lista (`carouselSections`)**, em vez de repetir `<MovieCarousel>` uma vez por seção — adicionar uma nova categoria na home (feito para "Melhores Avaliados") é só acrescentar `{ title, movies }` nessa lista.
