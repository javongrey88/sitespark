// pages/auth/signin.tsx
import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function SignIn({ providers }: any) {
  // 1) Guard against null/undefined
  if (!providers) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading providers…</p>
    </div>;
  }

  // 2) Safe to map now
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl mb-4 text-center">Sign in to SiteSpark</h1>
        {Object.values(providers).map((prov: any) => (
          <button
            key={prov.id}
            onClick={() => signIn(prov.id)}
            className="block w-full mb-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign in with {prov.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return { props: { providers } };
};
