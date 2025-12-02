"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", city: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const API = process.env.NEXT_PUBLIC_API_HOST;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/users`, { cache: "no-store" });
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [API]);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers([created, ...users]);
      setForm({ name: "", email: "", city: "" });
      setMsg("User created");
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(err.error || "Failed to create");
    }
  }

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h1 className="title">Users - KyiTharHlaing-6704995</h1>

      <form className="card" onSubmit={submit}>
        <div className="row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
          />
          <button type="submit">Create</button>
        </div>
        {msg && <p className="muted">{msg}</p>}
      </form>

      <section className="grid">
        {users.map(u => (
          <article key={u.id} className="card">
            <h3>{u.name}</h3>
            <p>{u.email}</p>
            <small className="muted">{u.city}</small>
          </article>
        ))}
      </section>
    </main>
  );
}
