"use client";
import React, { ReactEventHandler } from "react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { Button, Card, CardBody, CardFooter, Input, Form } from "@heroui/react";
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";


interface Spv {
  NAME: string;
}

export const SpvEdit = () => {
  const token = Cookies.get("auth_token");
  const [formData, setFormData] = useState<Spv>({
    NAME: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Spv" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("supervisor.update");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPV_EDIT_URL_API}${id}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.status && result.message) {
        if (result.status == 200) {
          setFormData(result.data);
        }
      }
    };
    fetchData();


  }, []);

  const validateSchema = Yup.object().shape({
    NAME: Yup.string().required("Spv wajib diisi"),
  });

  const formik = useFormik<Spv>({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SPV_UPDATE_URL_API}${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(values),
            }
          );
          setIsLoading(true);
          const result = await response.json();

          if (result.status && result.message) {
            if (result.status == 200) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              formik.resetForm();
              setTimeout(async () => {
                setIsLoading(false);
                router.push("/master/spv");
              }, 500);
            } else {
              toast.error(result.message, {
                position: "top-right",
                autoClose: 2000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false);
            }
          } else {
            toast.error("Terjadi kesalahan pada sistem !", {
              position: "top-right",
              autoClose: 4000,
              pauseOnHover: true,
              transition: Bounce,
            });
            setIsLoading(false);
          }
        } catch (error: any) {
          toast.error(error.message, {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
          setIsLoading(false);
        }
      } else {
        toast.error("Koneksi gagal. Periksa jaringan Anda dan coba lagi.", {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
        setIsLoading(false);
      }
    },
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [name]: value,
      };
      return updatedValues;
    });
  };
  if (access === null) {
    return null;
  }

  if (!access) {
    return <ForbiddenError />;
  }
  return (
        <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
          <Breadcrumb items={breadcrumbItems} />
          <ToastContainer />
          <div className="flex justify-between flex-wrap gap-4 items-center">
            <h3 className="text-xl font-semibold">Edit Spv</h3>
            <div className="flex flex-row items-center gap-2.5 flex-wrap">
              <Button
                size="md"
                className="flex items-center bg-[#FFDD00]"
                onClick={() => router.push("/master/spv/")}
                startContent={<IoIosArrowBack className="text-lg" />}
              >
                <span className="pr-2 pb-[3px]">Back</span>
              </Button>
            </div>
          </div>
          <div className="max-w-[95rem] mx-auto w-full">
            <Card className="max-full p-3">
              <Form onSubmit={formik.handleSubmit}>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      autoFocus
                      isRequired
                      labelPlacement="outside"
                      label="Spv"
                      radius="sm"
                      name="NAME"
                      value={formData.NAME}
                      placeholder="Enter spv"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.NAME ? true : false}
                      errorMessage={
                        formik.errors.NAME ? formik.errors.NAME : ""
                      }
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
              </Form>
            </Card>
          </div>
        </div>
  );
};
