import React from "react";
import { PelangganEdit } from "@/components/master/pelanggan/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pelanggan Edit - SA Marketing",
  description: "SA Marketing",
};


const PelangganEditPage = () => {
  return (<PelangganEdit />)
};

export default PelangganEditPage;
