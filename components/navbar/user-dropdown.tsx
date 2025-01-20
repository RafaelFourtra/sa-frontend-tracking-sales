import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@heroui/react";
import React, { useCallback } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/actions/auth.action";
import Cookies from "js-cookie";

export const UserDropdown = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    Cookies.remove("auth_token")
    router.replace("/login");
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='secondary'
            size='md'
            src='/account.png'
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label='User menu actions'>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}>
          Log Out
        </DropdownItem>
        {/* <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};
