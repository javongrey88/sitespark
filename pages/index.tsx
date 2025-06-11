// pages/index.tsx

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import styles from "../styles/Home.module.css";

type Preview = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json() as Promise<Preview[]>);

export default function Home() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { data: previews, mutate } = useSWR<Preview[]>(
    session ? "/api/previews" : null,
    fetcher
  );

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return (
      <div className={styles.container}>
        <button className={styles.button} onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    const newPreview = await fetch("/api/previews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, url }),
    }).then((r) => r.json() as Promise<Preview>);
    mutate([newPreview, ...(previews ?? [])], { revalidate: false });
    setTitle("");
    setUrl("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hello, {session.user?.name || "there"}!</h1>
        <button className={styles.button} onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className={styles.formInput}
          type="text"
          placeholder="Preview title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={styles.formInput}
          type="url"
          placeholder="Preview URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Save Preview
        </button>
      </form>

      <ul>
        {previews?.map((p: Preview) => (
          <li key={p.id} className={styles.listItem}>
            <a href={p.url} target="_blank" rel="noreferrer">
              {p.title}
            </a>
            <div className={styles.timestamp}>
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
