"use client";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { Button, Input, Card, CardBody, CardFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, {useState, useEffect} from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast, ToastContainer, Bounce  } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";

interface PositionData {
  position: string;
}

export const PositionCreate = () => {
  const [isLoading, setIsLoading] = useState(false)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Position" },
    { label: "Create" },
  ];

  const validateSchema = Yup.object().shape({
    position : Yup.string().required("Position wajib diisi"),
  });


  const formik = useFormik<PositionData>({
    initialValues: {
      position: "",
    },
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_POSITION_CREATE_URL_API}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          setIsLoading(true)
          const result = await response.json();
          
          if(result.status && result.message) {
            if(result.status == 201){
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              formik.resetForm();
              setIsLoading(false)
            } else {
              toast.error(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false)
            }
          } else {
            toast.error('Terjadi kesalahan pada sistem !', {
              position: "top-right",
              autoClose: 4000,
              pauseOnHover: true,
              transition: Bounce,
            });
            setIsLoading(false)
          }
         
        } catch (error: any) {
            toast.error(error.message, {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
          setIsLoading(false)
        }
      } else {
        toast.error('Koneksi gagal. Periksa jaringan Anda dan coba lagi.', {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
        setIsLoading(false)
      }
    },
  });

  const handleChangeInput= (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof PositionData, value);
  }

  const router = useRouter();
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
       <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Create Position</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/position")}
            startContent={<IoIosArrowBack className="text-lg"/>}
          >
             <span className="pr-2 pb-[3px]">Back</span>
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
      <Card className="max-full p-3">
      <form onSubmit={formik.handleSubmit}>
        <CardBody>
        <div className="grid grid-cols-2 gap-4">
            <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Position"
              radius="sm"
              name="position"
              value={formik.values.position}
              placeholder="Enter position"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.position ? true : false}
              errorMessage = {formik.errors.position ? formik.errors.position : ''}
          /> 
      </div>
        </CardBody>
        <CardFooter>
        <div className="flex justify-end w-full">
          <Button
            size="md"
            color="primary"
            className="mt-3 flex items-center"
            type="submit"
            isLoading={isLoading}
          >
          <span>Submit</span>
          </Button>
        </div>
        </CardFooter>
        </form>
      </Card>
        
      </div>
    </div>
  );
};
