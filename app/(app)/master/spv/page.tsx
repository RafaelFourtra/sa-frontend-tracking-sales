import React from "react";
import { Spv } from "@/components/master/spv";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Spv - SA Marketing",
  description: "SA Marketing",
};


const SpvPage = () => {
  return (<Spv />)
};

export default SpvPage;
