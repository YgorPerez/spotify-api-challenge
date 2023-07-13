# Tecnologias
- [Next.js](https://nextjs.org)
- [React](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Clerk](https://clerk.dev)
- [Cypress](https://www.cypress.io/)
- [TanStack Query](https://tanstack.com/query/latest)
- [T3 Stack](https://create.t3.gg/)
- [Upstash Ratelimiting](https://upstash.com/blog/upstash-ratelimit)
- [Axiom](https://axiom.co)
---
Um desafio de https://github.com/RodyRafa/challenge/tree/master/react
---
# Requisitos
- [x] Possibilidade de inserir o nome da música ou do álbum e obter uma lista;
- [x] Caso um album seja procurado e retornado, quando selecionado o album, usuário será direcionado a lista de música desse album.
- [x] Reproduzir a preview da música.
- [x] É necessário utilizar React;
- [x] Você deve criar um repositório e compartilhar com a gente;
- [ ] Não deve usar nenhum Framework CSS (Bootstrap, PureCss, etc.);
- [ ] Não deve usar scaffolds (Create React App, etc.), queremos ver como vai construir a estrutura do seu projeto;
- [x] Quero poder rodar o seu projeto com yarn/npm start;
- [x] A aplicação deve solicitar o token que será utilizado para realizar as requisições para a API;
- [x] Persistência do TOKEN, quando expirado solicitar um novo token;
- [x] Precisamos ter certeza que nossa aplicação funciona conforme o esperado, alguns testes seriam bem vindos, estamos usando por aqui enzyme e jest, mas sinta-se a vontade para testar com o que sente maior conforto.
- [x] Pense que sua aplicação passará por 3 ambientes, DSV - HML - PRD, monte build e use variaveis de ambiente.

## Requisitos adicionais
- [x] Quando o usuário fizer uma requisição seria legal salvar dentro do redux, caso ele digite e busque novamente o album nós pegamos uma cópia de lá para não fazer múltiplas requisições para a API.
- [x] Quando o usuário entrar na aplicação podemos exibir uma lista com os últimos albums buscados/clicados para melhorar a experiência.
- [x] Hoje grande parte dos acessos a sites são feitos por celular, um layout responsivo faz todo sentido para nossa aplicação!
- [x] Nosso time de UX é bem exigente, pensam bastante na experiência do usuário, algumas animações e efeitos seriam interessantes também.

### Extras
- [x] Tudo usando uma infraestrutura grátis.
- [x] OAuth para fazer login e obter o token de acesso.
- [x] Scroll infinito e botão de carregar mais para um melhor UX.
- [x] Backend para que o token de acesso não fique exposto e para SSR.
- [x] Hospedado online no vercel.
- [x] Mostrar letras de músicas.
- [x] Tratamento de erros e fallbacks.
- [x] Testes E2E sem mockar nada.
- [x] CI e CD pipeline, testes automatizados em todo commit e deploy direto para a vercel.  
- [x] Observabilidade de erros em produção com Axiom.
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
Abra o terminal

Baixe o repositório com `git clone https://github.com/YgorPerez/spotify-api-challenge.git`

`cd spotify-api-challenge`

Rode `pnpm i`

Abra o arquivo .env.example e siga as intruçöes

Agora você pode rodar o projeto com `pnpm dev` e vai estar no localhost:3000

# Limitaçöes
O spotify deixa apenas emails registrados no dashboard conectar no app com a versäo de desenvolvedor 
entäo qualquer um que quiser ver o app vai ter que me pedir para adicionar seu email do spotify lá.
Eu já requisitei acesso a extensäo de quota deles para permitir qualquer usuário, mas é possível que 
eu näo consiga já que eles tem muitos e muitos requistos que acabariam degradando a UI do aplicativo
e eu decidi näo implementar para seguir layout.

Eu näo consigo rodar todo o backend no edge runtime devido à uma limitação da vercel em modo 
gratuíto que permite apenas 1MB para o tamanho da funçäo edge e eu utilizo 80KB a mais que isso. 

# Veja o app
Página inicial do app
![Página inicial do app](/public/images/home-preview.png "Página inicial do app")
Página inicial do app no light mode
![Página inicial do app no light mode](/public/images/home-preview-light.png "Página inicial do app no light mode")
![Página inicial do app no mobile](/public/images/home-preview-mobile.png "Página inicial do app no mobile")
Página de álbum do app
![Página de álbum do app](/public/images/album-preview.png "Página de álbum do app")
Página de álbum do app no light mode
![Página de álbum do app no light mode](/public/images/album-preview-light.png "Página de álbum do app no light mode")
![Página de álbum do app no mobile](/public/images/album-preview-mobile.png "Página de álbum do app no mobile")
