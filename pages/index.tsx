// pages/index.tsx
import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import { Box, Button, Flex, Input, List, ListItem, Text } from "@chakra-ui/react";
// … etc.


export default function Home() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { data: previews, mutate } = useSWR(
    session ? "/api/previews" : null,
    (u) => fetch(u, { credentials: "include" }).then((r) => r.json())
  );

  if (status === "loading") return <p>Loading…</p>;
  if (!session)
    return (
      <div className={styles.container}>
        <button className={styles.button} onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    const newP = await fetch("/api/previews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, url }),
    }).then((r) => r.json());
    mutate([newP, ...(previews || [])], { revalidate: false });
    setTitle(""); setUrl("");
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
          placeholder="Preview title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={styles.formInput}
          placeholder="Preview URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className={styles.button} type="submit">Save Preview</button>
      </form>

      <ul>
        {previews?.map((p: any) => (
          <li key={p.id} className={styles.listItem}>
            <a href={p.url} target="_blank" rel="noreferrer">{p.title}</a>
            <div className={styles.timestamp}>
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
