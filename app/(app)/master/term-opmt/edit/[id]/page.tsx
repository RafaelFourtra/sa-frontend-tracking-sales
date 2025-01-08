import React from "react";
import { TermOpmtEdit } from "@/components/master/term-opmt/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Syarat Pembayaran Edit - SA Marketing",
  description: "SA Marketing",
};


const TermOpmtEditPage = () => {
  return (<TermOpmtEdit />)
};

export default TermOpmtEditPage;
