"use client";
import React, { useState, useEffect }  from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  icon: React.ReactNode;
  title: string;
  items: { label: string; href: string }[]; // Menyusun array objek dengan label dan href
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  const [open, setOpen] = useState(false);
  const [parentMenu, setParentMenu] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const isAnyItemActive = items.some(({ href }) => pathname === href || pathname.startsWith(href + '/'));
    setOpen(isAnyItemActive);
    setParentMenu(isAnyItemActive)
  }, [pathname, items]);


  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180 text-[#A1A1AA] hover:text-default-900",
            trigger: clsx(
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5 group",
              parentMenu ? "bg-default-100 text-black [&_svg_path]:fill-black" : "text-[#A1A1AA]"
            ),
            title: "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span className={clsx(
                  "text-[#A1A1AA] group-hover:text-default-900 transition-colors",
                  parentMenu && "text-black"
                )}>
                  {title}
                </span>
            </div>
          }
        >
          {items.map(({ label, href }, index) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');

            return (
              <NextLink href={href} key={index}>
                <div  
                  className={clsx(
                      "hover:bg-default-100 flex gap-2 w-full min-h-[44px] h-full items-center rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]",
                      "group",
                      isActive && "bg-gray-200" 
                  )}
                >
                  <span className={clsx(
                    isActive 
                    ? "text-black"
                    : "text-[#A1A1AA]",
                      "group-hover:text-black",
                      "w-full flex py-1 text-[#A1A1AA] hover:text-default-900 transition-colors pl-7"
                    )}>
                    {label}
                  </span>
                </div>
              </NextLink>
            );
          })}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
