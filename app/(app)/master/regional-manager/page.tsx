import React from "react";
import { RegionalManager } from "@/components/master/regional-manager";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Regional Manager - SA Marketing",
  description: "SA Marketing",
};


const RegionalManagerPage = () => {
  return (<RegionalManager />)
};

export default RegionalManagerPage;
