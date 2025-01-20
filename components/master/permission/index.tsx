"use client";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { Button, Input, Card, CardBody, CardFooter, Form, Divider, CheckboxGroup, Checkbox, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from 'react-select';
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";

interface Permission {
  USERID: string;
  PERMISSION: string[];
}

export const Permission = () => {
  const [isLoading, setIsLoading] = useState(false)
  const token = Cookies.get("auth_token");
  const [userPermission, setUserPermission] = useState([])
  const [permission, setPermission] = useState([])
  const [user, setUser] = useState([])
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)


  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Permission" },
    { label: "list" },
  ];

  useEffect(() => {
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("permission.update");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const validateSchema = Yup.object().shape({
    USERID: Yup.string().required("User wajib diisi"),
  });


  const formik = useFormik<Permission>({
    initialValues: {
      USERID: "",
      PERMISSION: [],
    },
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_PERMISSION_UPDATE_URL_API}${formik.values.USERID}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          });
          setIsLoading(true)
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`,
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
          const formatted = result.data.map((user: any) => ({
            label: `${user.NAME} (${user.ROLE})`,
            value: user.ID
          }));
          setUser(formatted || [])
        }
      }

      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_PERMISSION_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result2 = await response2.json();

      if (result2.status && result2.message) {
        if (result2.status == 200) {
          const formatted2 = result2.data.map((perm: any) => ({
            label: perm.NAME,
            value: perm.NAME
          }));
          setPermission(formatted2 || [])
        }
      }
    }
    fetchData()

  }, []);

  useEffect(() => {
    if (!formik.values.USERID) {
      formik.setFieldValue("PERMISSION", []);
      return;
    };
    const fetchDataUserPerm = async () => {
      const response3 = await fetch(
        `${process.env.NEXT_PUBLIC_PERMISSION_EDIT_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result3 = await response3.json();

      if (result3.status && result3.message) {
        if (result3.status == 200) {
          const permissions = result3.data
            .filter(item => item.USERID === formik.values.USERID)
            .map(item => item.PERMISSION);
          formik.setFieldValue("PERMISSION", permissions);
        }
      }
    }
    fetchDataUserPerm()
  }, [formik.values.USERID])
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof Permission, value);
  }

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : '';


    formik.setFieldValue(name, value);
  }

  const checkAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    if (checked) {
      const allPermissions = permission.map((p) => p.value);
      formik.setFieldValue("PERMISSION", allPermissions);
    } else {
      formik.setFieldValue("PERMISSION", [])
    }
  }
  const router = useRouter();
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
            <h3 className="text-xl font-semibold">User Permission</h3>
          </div>
          <div className="max-w-[95rem] mx-auto w-full">
            <Card className="max-full p-3">
              <Form onSubmit={formik.handleSubmit}>
                <CardBody>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.USERID ? 'text-[#F31260]' : ''}`}>User <span className="text-red-500">*</span></h3>
                      <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.USERID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a user"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="USERID"
                        options={user}
                        value={user.find(option => option.value === formik.values.USERID) || null}
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta)
                        }
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            backgroundColor: 'transparent',
                            borderWidth: formik.errors.USERID ? '2px' : '1px',
                            borderColor: formik.errors.USERID
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
                      {formik.errors.USERID && (
                        <span className="text-[#F31260] text-xs ml-1">{formik.errors.USERID}</span>
                      )}
                    </div>
                  </div>
                  <Divider className="my-5" />
                  <div className="">
                    <h3 className="text-lg">Permission</h3>
                    <Chip radius="sm" className="mt-3 bg-[#FFDD00]">
                      <Checkbox size="md" isDisabled={formik.values.USERID ? false : true} onChange={checkAll}>
                        Check All
                      </Checkbox>
                    </Chip>


                  </div>
                  <CheckboxGroup
                    className="mt-3"
                    orientation="horizontal"
                    // defaultValue={userPermission}
                    value={formik.values.PERMISSION}
                    onChange={(newValues) => formik.setFieldValue("PERMISSION", newValues)}
                    isDisabled={formik.values.USERID ? false : true}
                  >
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      {permission.map((p) => (
                        <Checkbox value={p.value} key={p.value}>{p.label}</Checkbox>
                      ))}
                    </div>
                  </CheckboxGroup>
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
