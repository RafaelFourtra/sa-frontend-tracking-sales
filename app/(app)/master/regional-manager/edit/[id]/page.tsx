import React from "react";
import { RegionalManagerEdit } from "@/components/master/regional-manager/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Regional Manager Edit - SA Marketing",
  description: "SA Marketing",
};


const RegionalManagerEditPage = () => {
  return (<RegionalManagerEdit />)
};

export default RegionalManagerEditPage;
