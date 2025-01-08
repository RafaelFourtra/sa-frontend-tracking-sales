import React from "react";
import { PelangganCreate } from "@/components/master/pelanggan/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pelanggan Create - SA Marketing",
  description: "SA Marketing",
};


const PelangganCreatePage = () => {
  return (<PelangganCreate />)
};

export default PelangganCreatePage;
