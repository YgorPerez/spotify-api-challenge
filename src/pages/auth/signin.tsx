import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";

interface SignInProps {
  providers: Provider[];
}

const SignIn = ({ providers }: SignInProps) => {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="rounded-full bg-white p-4 text-xl transition-all delay-75 hover:scale-105 hover:bg-gray-200"
              onClick={() => void signIn(provider.id, { callbackUrl: "/" })}
            >
              {provider.name === "Spotify" && (
                <FontAwesomeIcon
                  icon={faSpotify}
                  className="mr-4 rounded-full align-middle text-green-600"
                  size="2x"
                />
              )}
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </main>
    </>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
