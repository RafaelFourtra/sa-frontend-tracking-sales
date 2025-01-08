import React from "react";
import { SalesEdit } from "@/components/master/sales/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Edit - SA Marketing",
  description: "SA Marketing",
};


const SalesEditPage = () => {
  return (<SalesEdit />)
};

export default SalesEditPage;
