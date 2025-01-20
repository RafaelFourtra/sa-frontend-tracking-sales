import React from "react";
import { Visit } from "@/components/visit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Visit - SA Marketing",
  description: "SA Marketing",
};


const VisitPage = () => {
  return (<Visit />)
};

export default VisitPage;
