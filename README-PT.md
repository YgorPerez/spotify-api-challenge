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
- [ ] Precisamos ter certeza que nossa aplicação funciona conforme o esperado, alguns testes seriam bem vindos, estamos usando por aqui enzyme e jest, mas sinta-se a vontade para testar com o que sente maior conforto.
- [x] Pense que sua aplicação passará por 3 ambientes, DSV - HML - PRD, monte build e use variaveis de ambiente.

## Requisitos adicionais
- [x] Quando o usuário fizer uma requisição seria legal salvar dentro do redux, caso ele digite e busque novamente o album nós pegamos uma cópia de lá para não fazer múltiplas requisições para a API.
- [x] Quando o usuário entrar na aplicação podemos exibir uma lista com os últimos albums buscados/clicados para melhorar a experiência.
- [x] Hoje grande parte dos acessos a sites são feitos por celular, um layout responsivo faz todo sentido para nossa aplicação!
- [x] Nosso time de UX é bem exigente, pensam bastante na experiência do usuário, algumas animações e efeitos seriam interessantes também.

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
Abra o terminal

Baixe o repositório com `git clone https://github.com/YgorPerez/spotify-api-challenge.git`

cd spotify-api-challenge

Rode `pnpm i`

Agora você pode rodar o projeto com `pnpm dev` e vai estar no localhost:3000