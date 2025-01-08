import React from "react";
import { SalesManEdit } from "@/components/master/sales-man/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Man Edit - SA Marketing",
  description: "SA Marketing",
};


const SalesManEditPage = () => {
  return (<SalesManEdit />)
};

export default SalesManEditPage;
