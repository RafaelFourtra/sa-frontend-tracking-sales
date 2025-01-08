import React from "react";
import { Permission } from "@/components/master/permission";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Permission - SA Marketing",
  description: "SA Marketing",
};


const PermissionPage = () => {
  return (<Permission />)
};

export default PermissionPage;
