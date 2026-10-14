"use client";

import { useState } from "react";

// Demo only. Plan step 5 connects this to a real contact handler.
export function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("Add a valid email and a message.");
      return;
    }
    setStatus("Preview only. This note wasn't sent.");
    setName("");
    setEmail("");
    setMsg("");
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <h3>Get in touch</h3>
          <p className="lead">Have a question about the site? Send us a note.</p>
        </div>
        <form className="footer-form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="c-email">Your email</label>
            <input id="c-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field wide">
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div className="row">
            <button type="submit" className="btn">Send note</button>
            <span className="status" role="status">{status}</span>
          </div>
        </form>
      </div>
      <p className="footer-note">Prototype. Notes stay in this browser only until the shared database is connected.</p>
    </footer>
  );
}
