import React from "react";
import { User } from "@/components/master/user";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "User | SA Marketing",
  description: "SA Marketing",
};


const UserPage = () => {
  return (<User />)
};

export default UserPage;
