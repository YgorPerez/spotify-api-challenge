const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	if (process.env.LOCALHOST_HTTPS)
		return `https://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost with https
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost with http
};

export default getBaseUrl;
