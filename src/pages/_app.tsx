import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { lazy, Suspense, useEffect, useState } from "react";
import "../styles/globals.css";
import { api } from "../utils/api";
config.autoAddCss = false;

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);
  // this way the react query devtools can be downloaded in production using window.toggleDevtools() on console

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
