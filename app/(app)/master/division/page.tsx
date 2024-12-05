import React from "react";
import { Division } from "@/components/master/division";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Division | SA Marketing",
  description: "SA Marketing",
};


const DivisionPage = () => {
  return (<Division />)
};

export default DivisionPage;
