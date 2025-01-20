"use client";

import Cookies from "js-cookie";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input, Form, Image } from "@heroui/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const router = useRouter();

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = async (values: LoginFormType,) => {
    const { email, password } = values;
    
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CITY_LOGIN_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();

      if(result.status == 200){
        const token = await result.data;


        if (token != undefined && token != null){
          Cookies.set("auth_token", token, {
            expires: 1,
            sameSite: "strict", 
          });
          router.replace("/home")
        } else {
          toast.error("Token Undefined", {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
        }
       
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-slate-50 p-8  drop-shadow-sm rounded-md shadow-[0_0_20px_#ccc] relative z-10">
      {/* Header Login */}
      <ToastContainer />
      <div className="text-center">
        <Image
            className="mr-3 mb-2"
            src="/logo.png"
            width={220}
          />
        <h3 className="text-[15px] font-medium mb-4 text-slate-950">Sign into Your account</h3>
      </div>

      {/* Form Login */}
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleLogin}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {/* Input Email */}
            <Input
              variant="bordered"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={values.email}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              onChange={handleChange("email")}
              className="w-full text-black border-black focus:border-yellow-500"
              autoComplete="email"
            />

            {/* Input Password */}
            <Input
              variant="bordered"
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={values.password}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              onChange={handleChange("password")}
              className="w-full text-black border-black focus:border-yellow-500"
              autoComplete="current-password"
            />

            {/* Tombol Login */}
            <Button
              type="submit"
              variant="flat"
              className="w-full bg-slate-950 text-neutral-100 text-lg font-semibold">
              Login
            </Button>
          </Form>
        )}
      </Formik>

      {/* Link Registrasi */}
      <div className="font-light text-gray-700 mt-4 text-sm">
        Forgot Password?{" "}
        <Link
          href=""
          className="font-bold text-yellow-500 hover:underline">
          Call Admin
        </Link>
      </div>
    </div>
  );
};
