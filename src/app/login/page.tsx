"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      subscription: "free"
    });
  }

  alert("Uspešna registracija");
}

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Ulogovan");
    }
  }

  return (
    <div className="p-10 flex flex-col gap-3 max-w-md">
      <h1 className="text-3xl">Accordion Login</h1>

      <input
  type="email"
  className="border p-2"
  placeholder="Email"
  value={email}
  onChange={(e)=>setEmail(e.target.value)}
/>
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="border p-2"
        onClick={signUp}
      >
        Register
      </button>

      <button
        className="border p-2"
        onClick={signIn}
      >
        Login
      </button>
    </div>
  );
}