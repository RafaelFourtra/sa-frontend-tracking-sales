"use client"
import { Card, CardBody, Chip } from "@heroui/react";
import React, {useEffect, useState} from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import Cookies from "js-cookie";
import { Community } from "../icons/community";

export const CardBalance2 = () => {
  const [value, setValue] = useState(0);
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DASHBOARD_COUNT_AM_DATATABLE_URL_API}`,
          {
            cache: "no-store",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status == 200) {
          setValue(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    }
      fetchData()
  }, [])
  return (
    <Card className="xl:max-w-sm bg-[#f7d205] rounded-xl shadow-md px-2 w-full">
      <CardBody className="py-5 overflow-hidden">
        <div>
        <div className="flex flex-row gap-4 flex-wrap 2xl:mt-3 lg:mt-4 mt-3 px-3">
          <div>
           <h1 className="text-[16.5px] font-normal">Area Manager</h1>
          </div>
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap mt-2 px-4">
          <div>
          <Community />
          </div>
          <div>
          <h1 className="2xl:text-4xl lg:text-3xl text-4xl font-bold">{value}</h1>
          </div>
        </div>
        </div>
      </CardBody>
    </Card>
  );
};
