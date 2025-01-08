import React from "react";
import { RegionalManagerCreate } from "@/components/master/regional-manager/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Regional Manager Create - SA Marketing",
  description: "SA Marketing",
};


const RegionalManagerCreatePage = () => {
  return (<RegionalManagerCreate />)
};

export default RegionalManagerCreatePage;
