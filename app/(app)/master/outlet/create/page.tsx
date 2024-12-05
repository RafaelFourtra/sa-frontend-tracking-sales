import  React  from "react";
import { OutletCreate } from "@/components/master/outlet/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Outlet Create | SA Marketing",
    description: "SA Marketing",
};

const OutletCreatePage = () => {
    return (<OutletCreate />)
} 


export default OutletCreatePage;