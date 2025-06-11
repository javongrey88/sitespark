// pages/auth/signin.tsx

import type { GetServerSideProps } from "next";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import type { BuiltInProviderType } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";

// Strongly type the providers object
type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

// The SignIn page component
export default function SignIn({ providers }: { providers: Providers }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl mb-4">Sign in to SiteSpark</h1>
        {Object.values(providers).map((prov) => (
          <button
            key={prov.id}
            onClick={() => signIn(prov.id)}
            className="block w-full mb-2 p-2 border rounded"
          >
            Sign in with {prov.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Fetch the providers server-side so we can pass them in as props
export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers: providers ?? ({} as Providers),
    },
  };
};
