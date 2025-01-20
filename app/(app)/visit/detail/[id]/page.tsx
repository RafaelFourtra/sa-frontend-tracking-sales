import React from "react";
import { VisitDetail } from "@/components/visit/detail";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Visit Detail - SA Marketing",
  description: "SA Marketing",
};


const VisitDetailPage = () => {
  return (<VisitDetail />)
};

export default VisitDetailPage;
