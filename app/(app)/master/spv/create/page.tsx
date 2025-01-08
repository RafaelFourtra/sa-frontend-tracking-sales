import React from "react";
import { SpvCreate } from "@/components/master/spv/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Spv Create - SA Marketing",
  description: "SA Marketing",
};


const SpvCreatePage = () => {
  return (<SpvCreate />)
};

export default SpvCreatePage;
