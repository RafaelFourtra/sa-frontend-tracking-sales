import React from "react";
import { TermOpmt } from "@/components/master/term-opmt";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Syarat Pembayaran - SA Marketing",
  description: "SA Marketing",
};


const TermOpmtPage = () => {
  return (<TermOpmt />)
};

export default TermOpmtPage;
