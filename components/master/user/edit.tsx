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
import Select from 'react-select';
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";


interface User {
  EMAIL: string;
  PASSWORDOLD: string;
  PASSWORDNEW: string;
  TYPE: string;
  ROLE: string;
  USER: string;
}

export const UserEdit = () => {
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(false);
  const [userSelect, setUserSelect] = useState([])
  const [roleSelected, setRoleSelected] = useState()
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "User" },
    { label: "Edit" },
  ];

  useEffect(() => {
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("user.update");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const role = [
    { label: "Sales", value: "Sales" },
    { label: "Supervisor", value: "Supervisor" },
    { label: "Area Manager", value: "Area Manager" },
    { label: "Regional Manager", value: "Regional Manager" },
  ]

  const type = [
    { label: "Mobile", value: "1" },
    { label: "Hybrid", value: "2" },
  ]

  const validateSchema = Yup.object().shape({
    EMAIL: Yup.string().required("Email wajib diisi").email("Format email tidak sesuai"),
    TYPE: Yup.string().required("Type user wajib diisi"),
    ROLE: Yup.string().required("Role wajib diisi"),
    USER: Yup.string().required("User wajib diisi"),
    PASSWORDOLD: Yup.string(),
    PASSWORDNEW: Yup.string().when("PASSWORDOLD", (PASSWORDOLD, schema) => {
      if (String(PASSWORDOLD)) {
        return schema.required("Password baru wajib diisi, jika kolom password lama diisi");
      }
      return schema;
    }),
  });




  useEffect(() => {
    const fetchDataEdit = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USER_EDIT_URL_API}${id}`,
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
          formik.setFieldValue("EMAIL", result.data.EMAIL)
          formik.setFieldValue("TYPE", result.data.TYPE)
          formik.setFieldValue("ROLE", result.data.ROLE)
          formik.setFieldValue("USER", result.data.USERID)
          setRoleSelected(result.data.ROLE)
        }
      }
    };
    fetchDataEdit();
  }, []);



  const formik = useFormik<User>({
    initialValues: {
      EMAIL: "",
      PASSWORDOLD: "",
      PASSWORDNEW: "",
      TYPE: "",
      ROLE: "",
      USER: "",
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_USER_UPDATE_URL_API}${id}`,
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
                router.push("/master/user");
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

  useEffect(() => {
    if (formik.values.ROLE) {
      const fetchData = async () => {
        let url = '';
        if (formik.values.ROLE == 'Sales') {
          url = `${process.env.NEXT_PUBLIC_SALES_INDIVIDU_DATATABLE_URL_API}`
        } else if (formik.values.ROLE == 'Supervisor') {
          url = `${process.env.NEXT_PUBLIC_SPV_DATATABLE_URL_API}`
        } else if (formik.values.ROLE == 'Area Manager') {
          url = `${process.env.NEXT_PUBLIC_AREA_MANAGER_DATATABLE_URL_API}`
        } else if (formik.values.ROLE == 'Regional Manager') {
          url = `${process.env.NEXT_PUBLIC_REGIONAL_MANAGER_DATATABLE_URL_API}`
        }

        if (url && url != '') {
          const response = await fetch(url,
            {
              cache: "no-store",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          )
          const data = await response.json()
          if (data.status && data.status == 200) {
            const formatted = data.data.map((dt: any) => ({
              label: dt.NAME,
              value: dt.ID
            }));
            setUserSelect(formatted || [])
          }
        }
      }
      fetchData();
    }
  }, [formik.values.ROLE]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof User, value);
  }

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption?.value;
    if (name == "ROLE") {
      if (formik.values.ROLE != value && roleSelected != value) {
        formik.setFieldValue("USER", null)
        setRoleSelected(null)
      }
    }
    formik.setFieldValue(name, value);
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
            <h3 className="text-xl font-semibold">Edit User</h3>
            <div className="flex flex-row items-center gap-2.5 flex-wrap">
              <Button
                size="md"
                className="flex items-center bg-[#FFDD00]"
                onPress={() => router.push("/master/user/")}
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
                      label="Email"
                      radius="sm"
                      type="email"
                      name="EMAIL"
                      value={formik.values.EMAIL}
                      placeholder="Enter email"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.EMAIL ? true : false}
                      errorMessage={formik.errors.EMAIL ? formik.errors.EMAIL : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Password Lama"
                      radius="sm"
                      type="password"
                      name="PASSWORDOLD"
                      value={formik.values.PASSWORDOLD}
                      placeholder="Enter password lama"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.PASSWORDOLD ? true : false}
                      errorMessage={formik.errors.PASSWORDOLD ? formik.errors.PASSWORDOLD : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Password Baru"
                      radius="sm"
                      type="password"
                      name="PASSWORDNEW"
                      value={formik.values.PASSWORDNEW}
                      placeholder="Enter password baru"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.PASSWORDNEW ? true : false}
                      errorMessage={formik.errors.PASSWORDNEW ? formik.errors.PASSWORDNEW : ''}
                    />
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TYPE ? 'text-[#F31260]' : ''}`}>Type <span className="text-red-500">*</span></h3>
                      <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.TYPE ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a type"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="TYPE"
                        options={type}
                        value={type.find(option => option.value === formik.values.TYPE) || null}
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta)
                        }
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            backgroundColor: 'transparent',
                            borderWidth: formik.errors.TYPE ? '2px' : '1px',
                            borderColor: formik.errors.TYPE
                              ? '#F31260'
                              : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '581px',
                            zIndex: 1000
                          }),
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base: any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
                          }),
                          placeholder: (base: any) => ({
                            ...base,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#6b6b72',
                          }),
                        }}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      />
                      {formik.errors.TYPE && (
                        <span className="text-[#F31260] text-xs ml-1">{formik.errors.TYPE}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.ROLE ? 'text-[#F31260]' : ''}`}>Role <span className="text-red-500">*</span></h3>
                      <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.ROLE ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a role"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="ROLE"
                        options={role}
                        value={role.find(option => option.value === formik.values.ROLE) || null}
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta)
                        }
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            backgroundColor: 'transparent',
                            borderWidth: formik.errors.ROLE ? '2px' : '1px',
                            borderColor: formik.errors.ROLE
                              ? '#F31260'
                              : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '581px',
                            zIndex: 1000
                          }),
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base: any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
                          }),
                          placeholder: (base: any) => ({
                            ...base,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#6b6b72',
                          }),
                        }}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      />
                      {formik.errors.ROLE && (
                        <span className="text-[#F31260] text-xs ml-1">{formik.errors.ROLE}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.USER ? 'text-[#F31260]' : ''}`}>Name <span className="text-red-500">*</span></h3>
                      <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.USER ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a name"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="USER"
                        options={userSelect}
                        value={userSelect.find(option => option.value === formik.values.USER) || null}
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta)
                        }
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            backgroundColor: 'transparent',
                            borderWidth: formik.errors.USER ? '2px' : '1px',
                            borderColor: formik.errors.USER
                              ? '#F31260'
                              : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '581px',
                            zIndex: 1000
                          }),
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base: any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
                          }),
                          placeholder: (base: any) => ({
                            ...base,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#6b6b72',
                          }),
                        }}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      />
                      {formik.errors.USER && (
                        <span className="text-[#F31260] text-xs ml-1">{formik.errors.USER}</span>
                      )}
                    </div>
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
