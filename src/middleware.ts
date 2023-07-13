import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/404', '/500', '/auth/sign-in'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
