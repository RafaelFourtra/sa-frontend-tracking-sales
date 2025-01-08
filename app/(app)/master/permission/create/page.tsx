import React from "react";
import { PermissionCreate } from "@/components/master/permission/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Permission Create - SA Marketing",
  description: "SA Marketing",
};


const PermissionCreatePage = () => {
  return (<PermissionCreate />)
};

export default PermissionCreatePage;
