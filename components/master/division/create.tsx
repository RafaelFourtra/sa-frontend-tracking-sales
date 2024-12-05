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

interface DivisionData {
  division: string;
  location: string;
  longitude?: string;
  latitude?: string; 
}

export const DivisionCreate = () => {
  const [isLoading, setIsLoading] = useState(false)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Division" },
    { label: "Create" },
  ];

  const validateSchema = Yup.object().shape({
    division : Yup.string().required("Division wajib diisi"),
    location : Yup.string().required("Location wajib diisi"),
    longitude: Yup.string().optional(),
    latitude: Yup.string().optional(),
  });


  const formik = useFormik<DivisionData>({
    initialValues: {
      division: "",
      location: "",
      longitude: "",
      latitude: "",
    },
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_DIVISION_CREATE_URL_API}`, {
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
    formik.setFieldValue(name as keyof DivisionData, value);
  }

  const router = useRouter();
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
       <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Create Division</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/division")}
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
              label="Division"
              radius="sm"
              name="division"
              value={formik.values.division}
              placeholder="Enter division"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.division ? true : false}
              errorMessage = {formik.errors.division ? formik.errors.division : ''}
          /> 
           <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Location"
              radius="sm"
              name="location"
              value={formik.values.location}
              placeholder="Enter location"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.location ? true : false}
              errorMessage = {formik.errors.location ? formik.errors.location : ''}
          /> 
           <Input
              autoFocus
              labelPlacement="outside"
              label="Longitude"
              radius="sm"
              name="longitude"
              value={formik.values.longitude}
              placeholder="Enter longitude"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.longitude ? true : false}
              errorMessage = {formik.errors.longitude ? formik.errors.longitude : ''}
          /> 
          <Input
              autoFocus
              labelPlacement="outside"
              label="Latitude"
              radius="sm"
              name="latitude"
              value={formik.values.latitude}
              placeholder="Enter latitude"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.latitude ? true : false}
              errorMessage = {formik.errors.latitude ? formik.errors.latitude : ''}
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
