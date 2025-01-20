import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

interface BreadcrumbsCustomProps {
  items: { label: string }[];
}

export const Breadcrumb = ({ items }: BreadcrumbsCustomProps) => {
  return (
    <>
      <Breadcrumbs
        color="foreground"
        variant="solid"
        classNames={{
          list: "bg-[#ffdd00] shadow-small mt-7",
        }}
        itemClasses={{
          item: " data-[current=true]:black",
          separator: "text-black",
        }}
      >
        {items.map((item, index) => (
          <BreadcrumbItem key={item.label}>{item.label}</BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </>
  );
};
