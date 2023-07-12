# Tecnologies
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
A challenge from https://github.com/RodyRafa/challenge/tree/master/react
---
# Requirements
- [x] Possibility to insert the name of the song or album and get a list;
- [x] If an album is searched and returned, when the album is selected, the user will be directed to the music list of that album.
- [x] Play the song preview.
- [x] You must use React;
- [x] You must create a repository and share it with us;
- [ ] You must not use any CSS Framework (Bootstrap, PureCss, etc.);
- [ ] You should not use scaffolds (Create React App, etc.), we want to see how you will build your project structure;
- [x] I want to be able to run your project running yarn/npm start;
- [x] The application must request the token that will be used to make requests to the API;
- [x] TOKEN persistence, when expired request a new token;
- [x] We need to make sure that our application works as expected, some tests would be welcome, we are using enzyme and jest here, but feel free to test with what you feel most comfortable with.
- [x] Think that your application will go through 3 environments, DSV - HML - PRD, mount build and use environment variables.

## Nice to haves
- [x] When the user makes a request, it would be nice to save it inside redux, if he types and searches for the album again, we get a copy from there so as not to make multiple requests to the API.
- [x] When the user enters the application, we can display a list with the last albums searched/clicked to improve the experience.
- [x] Today most of the accesses to websites are made by cell phone, a responsive layout makes perfect sense for our application!
- [x] Our UX team is very demanding, they think a lot about the user experience, some animations and effects would be interesting too.### Extras

### Extras
- [x] Everything running on a free infrastructure.
- [x] OAuth for logging in and getting the access token.
- [x] Infinite scroling and load more button for better ux.
- [x] Backend so that the access token doesn't get exposed and for SSR.
- [x] Deployed online on vercel.
- [x] Display song lyrics.
- [x] Error handling and fallbacks.
- [x] Errors observability with Axiom.
- [x] Analytics with @vercel/analytics.
- [x] Reusable ui components that you can add classes to.
- [x] Lazy loading components for better performance.
- [x] Full english and portuguese localization!
- [x] Dark mode and light mode.
- [x] SEO friendly.
- [x] SSR for speed and better SEO.
- [x] Ratelimiting the api through upstash.
- [x] Localhost query caching.
- [x] Playing the full song in case you have an premium account by using the spotify-web-player sdk.
- [x] Run on the edge runtime for maximum performance and lowest cost with no cold starts.
- [x] Fully typesafe by using strict Typescript and protecting the backend on the runtime by using zod.
- [x] Images optimized with sharp through vercel.
- [x] Middleware for ensuring that the user is logged in.
- [x] Panel with documentation for viewing the backend api.
- [x] Accesible for everyone, Screen reader friendly and keyboard navegation.
- [ ] Docker container.
- [ ] Transform in a PWA.
- [ ] Create blur url for images on load through server, for faster load speeds.
- [ ] Redis for caching the access token.

# Development

Open the terminal

Download the repo with git clone `https://github.com/YgorPerez/spotify-api-challenge.git`

`cd spotify-api-challenge`

Run `pnpm i`

Then go to the env.example and follow the instructions

Now you can run `pnpm dev` for serving the application on localhost:3000

# Limitations
spotify only leaves emails registered in the dashboard connect in the app so anyone who wants to 
see the app will have to ask me to add their spotify email there. I have already requested access 
to their quota extension to allow any user, but it is possible that I can't since they have lots
and lots of requirements that would end up degrading the app's UI and I decided not to implement 
it to follow the layout given.

I can't run all the backend on the edge runtime due to vercel limitation in mode
free that allows only 1MB for edge function size and I use 80KB more than that.

# View the app
App Home
![App Home](/public/images/home-preview.png "App Home")
App home in light mode
![App home in light mode](/public/images/home-preview-light.png "App home in light mode")
![Mobile App Home](/public/images/home-preview-mobile.png "Mobile App Home")
App album page
![App album page](/public/images/album-preview.png "App album page")
App album page in light mode
![App album page in light mode](/public/images/album-preview-light.png "App album page in light mode")
![Mobile App Album Page](/public/images/album-preview-mobile.png "Mobile App Album Page")
