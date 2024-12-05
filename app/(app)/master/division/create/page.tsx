import  React  from "react";
import { DivisionCreate } from "@/components/master/division/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Division Create | SA Marketing",
    description: "SA Marketing",
};

const DivisionCreatePage = () => {
    return (<DivisionCreate />)
} 


export default DivisionCreatePage;