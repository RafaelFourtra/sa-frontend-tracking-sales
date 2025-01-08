import React from "react";
import { TermOpmtCreate } from "@/components/master/term-opmt/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Syarat Pembayaran Create - SA Marketing",
  description: "SA Marketing",
};


const TermOpmtCreatePage = () => {
  return (<TermOpmtCreate />)
};

export default TermOpmtCreatePage;
