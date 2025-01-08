import React from "react";
import { Pelanggan } from "@/components/master/pelanggan";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pelanggan - SA Marketing",
  description: "SA Marketing",
};


const PelangganPage = () => {
  return (<Pelanggan />)
};

export default PelangganPage;
