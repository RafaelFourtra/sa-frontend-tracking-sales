import React from "react";
import { UserCreate } from "@/components/master/user/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "User Create - SA Marketing",
  description: "SA Marketing",
};


const UserCreatePage = () => {
  return (<UserCreate />)
};

export default UserCreatePage;
