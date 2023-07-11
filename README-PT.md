# Tecnologias
- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [React](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TanStack Query](https://tanstack.com/query/latest)
- [Upstash Ratelimiting](https://upstash.com/blog/upstash-ratelimit)
- [Clerk](https://clerk.dev)
- [Axiom](https://clerk.dev)

# Requisitos
- [x] Possibilidade de inserir o nome da música ou do álbum e obter uma lista;
- [x] Se um álbum for pesquisado e devolvido, quando o álbum for selecionado, o utilizador será direcionado para a lista de músicas desse álbum.
- [x] Reproduzir a pré-visualização da música.
- [x] É necessário utilizar React;
- [x] Tem de criar um repositório e partilhá-lo connosco;
- [ ] Não deve usar nenhuma Framework CSS (Bootstrap, PureCss, etc.);
- [ ] Não deve usar scaffolds (Create React App, etc.), queremos ver como vai construir a estrutura do seu projeto;
- [x] Quero poder executar o seu projeto com yarn/npm start;
- [x] A aplicação deve solicitar o token que será utilizado para efetuar pedidos à API;
- [x] Persistência do TOKEN, quando expirado solicitar um novo token;
- [] Precisamos ter certeza que nossa aplicação funciona como esperado, alguns testes seriam bem vindos, estamos usando enzima e jest aqui, mas sinta-se livre para testar com o que se sentir mais confortável.
- [x] Pense que sua aplicação passará por 3 ambientes, DSV - HML - PRD, monte o build e use variáveis de ambiente.

## É bom ter
- [x] Quando o utilizador faz um pedido, seria bom guardá-lo dentro do redux, se ele digitar e procurar o álbum novamente, obtemos uma cópia de lá para não fazer vários pedidos à API.
- [x] Quando o usuário entra na aplicação, podemos exibir uma lista com os últimos álbuns pesquisados/clicados para melhorar a experiência.
- [x] Hoje em dia a maioria dos acessos a sites são feitos por telemóvel, um layout responsivo faz todo o sentido para a nossa aplicação!
- [x] A nossa equipa de UX é muito exigente, pensam muito na experiência do utilizador, algumas animações e efeitos também seriam interessantes.

### Extras
- [x] Tudo usando uma infraestrutura grátis.
- [x] OAuth para fazer login e obter o token de acesso.
- [x] Backend para que o token de acesso não fique exposto e para SSR.
- [x] Hospedado online no vercel.
- [x] Mostrar letras de músicas.
- [x] Tratamento de erros e fallbacks.
- [x] Observabilidade de erros com Axiom.
- [x] Analitcs com @vercel/analytics.
- [x] Componentes de interface do usuário reutilizáveis aos quais você pode adicionar classes.
- [x] Lazy loading componens para carregar mais rápido.
- [x] Localização completa em inglês e português!
- [x] Modo escuro e modo claro.
- [x] SEO amigável.
- [x] SSR para velocidade e melhor SEO.
- [x] Ratelimitando a api através do upstash.
- [x] Cache de consulta no localhost.
- [x] Reproduzir a música completa no caso de ter uma conta premium usando o spotify-web-player sdk.
- [x] Executar no edge runtime para obter o máximo de desempenho e o menor custo, sem cold starts.
- [x] Totalmente typesafe usando Typescript e protegendo o backend em runtime usando zod.
- [x] Imagens optimizadas com sharp através da vercel.
- [x] Middleware para garantir que o usuário tem sessão iniciada.
- [x] Painel com documentação para visualização da api do backend.
- [x] Acessível para todos, Leitor de ecrã e navegação por teclado.
- [ ] Container Docker.
- [ ] Transformar numa PWA.
- [ ] Criar uma blur url para imagem carregar uma versão com blur e transicionar para ela completamente carregada para velocidades de carregamento mais rápidas.
- [ ] Redis para armazenar em cache o token de acesso.

# Desenvolvimento

Faça o fork do repositório

execute `pnpm i`

Em seguida, vá para o env.example e siga as instruções

execute `pnpm dev`

Traduzido com a versão gratuita do tradutor - www.DeepL.com/Translator
