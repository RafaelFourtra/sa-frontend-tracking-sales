import  React  from "react";
import { PositionCreate } from "@/components/master/position/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Position Create | SA Marketing",
    description: "SA Marketing",
};

const PositionCreatePage = () => {
    return (<PositionCreate />)
} 


export default PositionCreatePage;