"use client";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { Button, Input, Card, CardBody, CardFooter, DatePicker, Select as NextSelect, SelectItem, Image} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useDropzone } from 'react-dropzone'
import { parseDate } from "@internationalized/date";
import Select from 'react-select';

export const UserCreate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [filesPreview, setFilesPreview] = useState([]);
  const [optionsDivision, setOptionsDivision] = useState([]);
  const [optionsPosition, setOptionsPosition] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [initialValues, setInitialValues] = useState({
    nik: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    dateJoin: "",
    divisionId: "",
    positionId: "",
    role: "",
    imageProfile: "",
    supervisor: "",
    manager: "",
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => file.type.startsWith('image/'));

      if (validFiles.length !== acceptedFiles.length) {
        toast.error('Hanya file gambar yang diperbolehkan.', {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
      }

      setFilesPreview(
        validFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    }
  });

  useEffect(() => {
    return () => {
      filesPreview.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [filesPreview]);

  const imagePreview = filesPreview.map((file) => (
    <Image
      key={file.name}
      className="bg-auto"
      width={300}
      height={200}
      alt={`Preview of ${file.name}`}
      src={file.preview}
    />
  ));

  const router = useRouter();

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "User" },
    { label: "Create" },
  ];

  const roles = [
    { key: "sales", value: "sales", label: "Sales" },
    { key: "superuser", value: "superuser", label: "Super User" },
    { key: "supir", value: "supir", label: "Supir" },
    { key: "spv", value: "spv", label: "SPV" },
    { key: "manager", value: "manager", label: "Manager" },
    { key: "admin", value: "admin", label: "Admin" }
  ];

  const fetchData = async () => {
    try {
      NProgress.set(0.4);

      const responseMasterUser = await fetch(
        `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`
      )

      const dataMasterUser = await responseMasterUser.json()
      console.log(dataMasterUser)
      const formattedUsers = dataMasterUser.data.map((user :any) => ({
        label: user.name,  
        value: user.id    
      }));
      setUser(formattedUsers || [])

      const responseMasterDivision = await fetch(
        `${process.env.NEXT_PUBLIC_DIVISION_DATATABLE_URL_API}`
      )

      const dataMasterDivision = await responseMasterDivision.json()
      setOptionsDivision(dataMasterDivision.data || [])

      const responseMasterPosition = await fetch(
        `${process.env.NEXT_PUBLIC_POSITION_DATATABLE_URL_API}`
      )

      const dataMasterPosition = await responseMasterPosition.json()
      setOptionsPosition(dataMasterPosition.data || [])
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const validateSchema = Yup.object().shape({
    nik: Yup.string()
      .required("NIK wajib diisi")
      .length(16, "NIK harus 16 digit"),
    name: Yup.string()
      .trim()
      .required("Nama wajib diisi"),
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .min(6, "Password harus minimal 6 karakter")
      .required("Password wajib diisi"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone harus berupa angka")
      .required("Phone wajib diisi"),
    dateJoin: Yup.date()
      .typeError("Format Date Join tidak valid")
      .required("Date Join wajib diisi"),
    divisionId: Yup.string().required("Division wajib diisi"),
    positionId: Yup.string().required("Position wajib diisi"),
    role: Yup.string().required("Role wajib diisi"),
  });


  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const formData = new FormData();

          formData.append('nik', values.nik)
          formData.append('email', values.email)
          formData.append('password', values.password)
          formData.append('name', values.name)
          formData.append('phone', values.phone)
          formData.append('dateJoin', values.dateJoin)
          formData.append('divisionId', values.divisionId)
          formData.append('positionId', values.positionId)
          formData.append('role', values.role)
          formData.append('manager', values.manager)
          formData.append('supervisor', values.supervisor)

          let valid = true;
          if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.size > 307200) {
              toast.error('File terlalu besar. Maksimal ukuran file adalah 300 KB.', {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false);
              return;
            }
            formData.append('imageProfile', file);
          }
          
          if (!valid) return;          
          const response = await fetch(`${process.env.NEXT_PUBLIC_USER_CREATE_URL_API}`, {
            method: 'POST',
            body: formData,
          });
          setIsLoading(true)
          const result = await response.json();

          if (result.message) {
            if (result.status == 201) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              formik.resetForm();
              setSelectedDate(null)
              setFilesPreview([])
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

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    formik.setFieldValue(name, value);
  }

  const handleSelectChange = (selectedOption, { name }, isMulti) => {
    const value = isMulti
      ? Array.isArray(selectedOption)
        ? selectedOption.map(option => option.value)
        : [] 
      : selectedOption ? selectedOption.value : ''; 
  
    formik.setFieldValue(name, value);
  };

  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Create User</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/user")}
            startContent={<IoIosArrowBack className="text-lg" />}
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
                  label="NIK"
                  type="number"
                  radius="sm"
                  name="nik"
                  value={formik.values.nik}
                  placeholder="Enter nik"
                  variant="bordered"
                  onChange={handleChangeInput}
                  isInvalid={formik.errors.nik ? true : false}
                  errorMessage={formik.errors.nik ? formik.errors.nik : ''}
                />
                <Input
                  autoFocus
                  isRequired
                  labelPlacement="outside"
                  label="Name"
                  radius="sm"
                  name="name"
                  value={formik.values.name}
                  placeholder="Enter name"
                  variant="bordered"
                  onChange={handleChangeInput}
                  isInvalid={formik.errors.name ? true : false}
                  errorMessage={formik.errors.name ? formik.errors.name : ''}
                />
                <Input
                  autoFocus
                  isRequired
                  labelPlacement="outside"
                  label="Email"
                  type="email"
                  radius="sm"
                  name="email"
                  value={formik.values.email}
                  placeholder="Enter email"
                  variant="bordered"
                  onChange={handleChangeInput}
                  isInvalid={formik.errors.email ? true : false}
                  errorMessage={formik.errors.email ? formik.errors.email : ''}
                />
                <Input
                  autoFocus
                  isRequired
                  labelPlacement="outside"
                  label="Password"
                  radius="sm"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  placeholder="Enter password"
                  variant="bordered"
                  onChange={handleChangeInput}
                  isInvalid={formik.errors.password ? true : false}
                  errorMessage={formik.errors.password ? formik.errors.password : ''}
                />
                <Input
                  autoFocus
                  isRequired
                  labelPlacement="outside"
                  label="Phone"
                  radius="sm"
                  type="number"
                  name="phone"
                  value={formik.values.phone}
                  placeholder="Enter phone"
                  variant="bordered"
                  onChange={handleChangeInput}
                  isInvalid={formik.errors.phone ? true : false}
                  errorMessage={formik.errors.phone ? formik.errors.phone : ''}
                />
                <DatePicker
                  isRequired
                  name="dateJoin"
                  label={"Date Join"}
                  variant="bordered"
                  labelPlacement="outside"
                  value={selectedDate}
                  onChange={(value) => {
                    if (value) {
                      const { year, month, day } = value;
                      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      formik.setFieldValue("dateJoin", formattedDate);
                      const initialParsedDate = parseDate(formattedDate);
                      setSelectedDate(initialParsedDate);
                    }
                  }}
                  // value={formik.values.dateJoin || ""} 
                  isInvalid={formik.errors.dateJoin ? true : false}
                  errorMessage={formik.errors.dateJoin ? formik.errors.dateJoin : ''}
                />
                <NextSelect
                  isRequired
                  labelPlacement="outside"
                  label="Division"
                  name="divisionId"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a division"
                  value={formik.values.divisionId}
                  selectedKeys={[formik.values.divisionId]}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >
                  {optionsDivision.map((option: any) => (
                    <SelectItem key={option.id} value={option.id.toString()}>{option.division}</SelectItem>
                  ))}
                </NextSelect>
                <NextSelect
                  isRequired
                  labelPlacement="outside"
                  label="Position"
                  name="positionId"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a position"
                  value={formik.values.positionId}
                  selectedKeys={[formik.values.positionId]}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >
                  {optionsPosition.map((option: any) => (
                    <SelectItem key={option.id} value={option.id.toString()}>{option.position}</SelectItem>
                  ))}
                </NextSelect>
                <NextSelect
                  isRequired
                  labelPlacement="outside"
                  label="Role"
                  name="role"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a role"
                  value={formik.values.role}
                  selectedKeys={[formik.values.role]}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >
                  {roles.map(role => (
                    <SelectItem key={role.key} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </NextSelect>

              <div>
              <h3 className={`text-sm -mt-[3px] ml-0.5`}>Manager </h3>
               <Select
                  className={`basic-single mt-[7px]`}
                  classNamePrefix="select"
                  placeholder="Select a manager"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="manager"
                  value={user.find(option => option.value === formik.values.manager) || null} 
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, false) 
                  }
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: '1px',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      maxWidth: '581px',
                      zIndex: 1000
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      zIndex: 1050,
                    }),
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                    }),
                    placeholder: (base :any) => ({
                      ...base,
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem',
                      color: '#6b6b72',  
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              <div>
                <h3 className={`text-sm -mt-[3px] ml-0.5`}>Supervisor</h3>
               <Select
                  className="basic-multi-select mt-2"
                  classNamePrefix="select"
                  placeholder="Select a supervisor"
                  isDisabled={false}
                  isLoading={false} 
                  isMulti={true}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="supervisor"
                  value={
                    Array.isArray(formik.values.supervisor)
                      ? formik.values.supervisor.map(value => user.find(option => option.value === value))
                      : user.find(option => option.value === formik.values.supervisor) || null
                  }
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, true) 
                  }                  
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: '1px',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      maxWidth: '581px',
                      zIndex: 1000
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      zIndex: 1050,
                    }),
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                    }),
                    placeholder: (base :any) => ({
                      ...base,
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem',
                      color: '#6b6b72',  
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              <div></div>
                <section className="container">
                  <div>
                    <label className="text-[#020617] text-sm">Image Profile</label>
                  </div>
                  <div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0 mt-1">
                    <div className="relative w-full">
                      {/* Ensure that the spread props are applied correctly here */}
                      <div {...getRootProps({ className: 'dropzone' })} className="items-center justify-center max-w-xl mx-auto">
                        <label
                          className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                          id="drop"
                        >
                          <span className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="font-medium text-gray-600">
                              Drop files to Attach, or
                              <span className="text-blue-600 underline ml-[4px]">browse</span>
                            </span>
                          </span>
                          {/* Ensure getInputProps is used correctly here */}
                          <input {...getInputProps()} type="file" name="file_upload" className="hidden" accept="image/png,image/jpeg" id="input" />
                        </label>
                      </div>
                    </div>
                  </div>
                  </section>
                  <div>
                    <label className="text-[#020617] text-sm">Preview</label>
                    {imagePreview}
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
          </form>
        </Card>

      </div>
    </div>
  );
};
