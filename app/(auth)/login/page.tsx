import React from "react";
import { Login } from "@/components/auth/login";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login | SA Marketing",
  description: "SA Marketing",
};
const login = () => {
  return <Login />;
};

export default login;
