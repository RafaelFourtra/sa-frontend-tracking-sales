"use client";
import {
  Button,
  Input,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Tooltip,
  Select as NextSelect,
  SelectItem,
  Avatar
} from "@nextui-org/react";
import React from "react";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EditIcon } from "../../icons/table/edit-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Select from 'react-select';

interface Division {
  id: number;
  division: string;
  location: string;
}

interface Position {
  id: number;
  position: string;
}

interface User {
  id: number;
  nik: string;
  name: string;
  email: string;
  phone: number;
  dateJoin: string;
  division: Division;
  position: Position;
  role: string;
  imageUrl?: string;
  supervisor1Id: number;
  supervisor2Id: number;
  managerId: number;

}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export const User = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User[]>([]);
  const [optionsUser, setOptionsUser] = useState([]);
  const [optionsDivision, setOptionsDivision]  = useState<Division[]>([]); 
  const [optionsPosition, setOptionsPosition]  = useState<Position[]>([]); 

  const fetchData = async () => {
    try {
      NProgress.set(0.4);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`,
        { cache: "no-store" }
      );
      const data = await response.json();
      setUser(data.data || []);

      const formattedUsers = data.data.map((user :any) => ({
        label: user.name,  
        value: user.id    
      }));
      console.log(formattedUsers)
      setOptionsUser(formattedUsers || [])


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
      setUser([]);
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "User" },
    { label: "List" },
  ];

  const [formValues, setFormValues] = useState({
    nik: "",
    name: "",
    email: "",
    phone: "",
    division: "",
    location: "",
    position: "",
    role: "",
    manager: "",
    supervisor: "",
  });
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const rowsPerPage = 15;

  const handleSort = (columnKey: any) => {
    setSortDescriptor({
      column: columnKey.column,
      direction: columnKey.direction,
    });
  };

  const filteredUser = React.useMemo(() => {
    return user.filter((user) => {
      const matchesNik = formValues.nik
        ? user.nik.toLowerCase().includes(formValues.nik.toLowerCase())
        : true;
      const matchesName = formValues.name
        ? user.name.toLowerCase().includes(formValues.name.toLowerCase())
        : true;
      const matchesEmail = formValues.email
        ? user.email.toLowerCase().includes(formValues.email.toLowerCase())
        : true;
      const matchesPhone = formValues.phone
        ? user.phone.toString().includes(formValues.phone.toString())
        : true;
      const matchesDivision = formValues.division
      ? user.division.id
          .toString()
          .includes(formValues.division.toString())
      : true;
      const matchesLocation = formValues.location
      ? user.division.location
      .toLowerCase()
          .includes(formValues.location.toLowerCase())
      : true;
      const matchesPosition = formValues.position
      ? user.position.id.toString().includes(formValues.position.toString())
      : true;
      const matchesRole = formValues.role
      ? user.role.toLowerCase().includes(formValues.role.toLowerCase())
      : true;
      const matchesManager = formValues.manager
        ? user.managerId?.toString() === formValues.manager?.toString()
        : true;
      const matchesSupervisor = formValues.supervisor
        ?  user.supervisor1Id?.toString() === formValues.supervisor?.toString() || user.supervisor2Id?.toString() === formValues.supervisor?.toString()
        : true;

      return matchesNik && matchesName && matchesEmail && matchesPhone && matchesDivision && matchesPosition && matchesRole && matchesLocation && matchesManager && matchesSupervisor; 
    });
  }, [user, formValues]);

  const pages = filteredUser.length > 0 ? Math.ceil(filteredUser.length / rowsPerPage) : 1;
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

    const shortingRow = React.useMemo(() => {
    const data = [...filteredUser];
    const { column, direction } = sortDescriptor;

   
    data.sort((a, b): any => {
      const aValue = getNestedValue(a, column);
      const bValue = getNestedValue(b, column);
  
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
    });

    return data;
  }, [filteredUser, sortDescriptor]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return shortingRow.slice(start, end);
  }, [page, shortingRow]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [name]: value,
      };
      return updatedValues;
    });
  };

  const handleSelectChange = (selectedOption, {name}) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const resetForm = () => {
   setFormValues({
    nik: "",
    name: "",
    email: "",
    phone: "",
    division: "",
    location: "",
    position: "",
    role: "",
    manager: "",
    supervisor: "",
   })
  };

  const handleDelete = (id: any) => {
    swal({
      title: "Apakah Anda yakin?",
      text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (navigator.onLine) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_USER_DELETE_URL_API}${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (result.status && result.message) {
            if (result.status == 200) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });

              fetchData();
            } else {
              toast.error("Terjadi kesalahan pada sistem !", {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
            }
          } else {
            toast.error("Terjadi kesalahan pada sistem !", {
              position: "top-right",
              autoClose: 4000,
              pauseOnHover: true,
              transition: Bounce,
            });
          }
        } else {
          toast.error("Koneksi gagal. Periksa jaringan Anda dan coba lagi.", {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
        }
      } else {
      }
    });
  };
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <Card className="max-full">
        <CardBody>
          <form>
            <div className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
              <Input
                type="text"
                labelPlacement="outside"
                label="NIK"
                name="nik"
                placeholder="Enter nik"
                color="default"
                radius="sm"
                variant="bordered"
                className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                value={formValues.nik}
                onChange={handleChange}
              />
              <Input
                type="text"
                labelPlacement="outside"
                label="Name"
                name="name"
                placeholder="Enter name"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.name}
                onChange={handleChange}
              />
              <Input
                type="text"
                labelPlacement="outside"
                label="Email"
                name="email"
                placeholder="Enter email"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.email}
                onChange={handleChange}
              />
              <Input
                type="text"
                labelPlacement="outside"
                label="Phone"
                name="phone"
                placeholder="Enter phone"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.phone}
                onChange={handleChange}
              />
              <NextSelect
                labelPlacement="outside"
                label="Division"
                name="division"
                variant="bordered"
                 radius="sm"
                 placeholder="Select a division"
                 value={formValues.division}
                 selectedKeys={[formValues.division]}
                 onChange={(e) => handleSelectChange("division", e.target.value)}
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
              >
                {optionsDivision.map((option) => (
                  <SelectItem key={option.id}  value={option.id.toString()}>{option.division}</SelectItem>
                ))}
              </NextSelect>
              <Input
                type="text"
                labelPlacement="outside"
                label="Location"
                name="location"
                placeholder="Enter location"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.location}
                onChange={handleChange}
              />
              <NextSelect
                labelPlacement="outside"
                label="Position"
                name="position"
                variant="bordered"
                 radius="sm"
                 placeholder="Select a position"
                 value={formValues.position}
                 selectedKeys={[formValues.position]}
                 onChange={(e) => handleSelectChange("position", e.target.value)}
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
              >
                {optionsPosition.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>{option.position}</SelectItem>
                ))}
              </NextSelect>
              <NextSelect
                labelPlacement="outside"
                label="Role"
                name="role"
                variant="bordered"
                 radius="sm"
                 placeholder="Select a role"
                 value={formValues.role}
                 selectedKeys={[formValues.role]}
                 onChange={(e) => handleSelectChange("role", e.target.value)}
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
              >
                  <SelectItem key="sales" value="sales">Sales</SelectItem>     
                  <SelectItem key="super user" value="super user">Super User</SelectItem>
                  <SelectItem key="supir" value="supir">Supir</SelectItem>
                  <SelectItem key="spv" value="spv">SPV</SelectItem>
                  <SelectItem key="manager" value="manager">Manager</SelectItem>
                  <SelectItem key="admin" value="admin">Admin</SelectItem>
              </NextSelect>
              <div>
                <h3 className="text-sm -mt-1">Manager</h3>
               <Select
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a manager"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="manager"
                  value={optionsUser.find(option => option.value.toString() === formValues.manager.toString()) || null} 
                  options={optionsUser}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                <h3 className="text-sm -mt-1">Supervisor</h3>
               <Select
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a pj sales"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="supervisor"
                  value={optionsUser.find(option => option.value.toString() === formValues.supervisor?.toString()) || null} 
                  options={optionsUser}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
              <div className="flex flex-wrap md:mt-7 mt-3">
                <Button
                  size="sm"
                  color="warning"
                  title="Reset Filter"
                  className="ml-1 p-3  bg-[#ffde08] min-w-0 flex items-center justify-center"
                  onClick={resetForm}
                >
                  <VscDebugRestart className="text-lg text-white" />
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
        {/* <CardFooter>
        </CardFooter> */}
      </Card>

      {/* <Divider /> */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">All User</h3>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button
            size="md"
            color="primary"
            onClick={() => router.push("/master/user/create")}
          >
            Add User
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <Table
          onSortChange={handleSort}
          sortDescriptor={sortDescriptor}
          isStriped={true}
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                classNames={{
                  cursor: "bg-[#020617]",
                }}
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="no">NO</TableColumn>
            <TableColumn key="nik" allowsSorting>
              NIK
            </TableColumn>
            <TableColumn key="name" allowsSorting>
              NAME
            </TableColumn>
            <TableColumn key="email" allowsSorting>
              EMAIL
            </TableColumn>
            <TableColumn key="phone" allowsSorting>
              PHONE
            </TableColumn>
            <TableColumn key="division.division" allowsSorting>
              DIVISION
            </TableColumn>
            <TableColumn key="division.location" allowsSorting>
              LOCATION
            </TableColumn>
            <TableColumn key="position.position" allowsSorting>
              POSITION
            </TableColumn>
            <TableColumn key="role" allowsSorting>
              ROLE
            </TableColumn>
            <TableColumn key="manager.name" allowsSorting>
              MANAGER
            </TableColumn>
            <TableColumn key="supervisor1.name">
              SUPERVISOR
            </TableColumn>
            <TableColumn key="image" >
              IMAGE
            </TableColumn>
            <TableColumn key="action">ACTION</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            items={items}
          >
            {items.map((item, index) => (
              <TableRow key={item.id}>
                {(columnKey) => {
                  let cellContent;

                  switch (columnKey) {
                    case "nik":
                      cellContent = item.nik;
                      break;
                    case "name":
                      cellContent = item.name;
                      break;
                    case "email":
                      cellContent = item.email;
                      break;
                    case "phone":
                      cellContent = item.phone;
                      break;
                    case "division.division":
                      cellContent = item.division.division;
                      break;
                    case "division.location":
                      cellContent = item.division.location;
                      break;
                    case "position.position":
                      cellContent = item.position.position;
                      break;
                    case "role":
                      cellContent = item.role
                      .split(' ') 
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
                      .join(' ');
                      break;
                    case "manager.name":
                        cellContent = item.manager?.name;
                    break;
                    case "supervisor1.name":
                      cellContent = (item.supervisor1?.name || '') + (item.supervisor1?.name && item.supervisor2?.name ? ', ' : '') + (item.supervisor2?.name || '');                    break;
                    case "image":
                      cellContent = item.imageUrl ? (
                        <Avatar
                          isBordered
                          color="default"
                          radius="sm"
                          src={item.imageUrl}
                          className="w-20 h-20 text-large"
                        />
                      ) : (
                        <span>-</span>
                      );
                      break;
                    case "action":
                      cellContent = (
                        <div className="flex items-center gap-4">
                          {/* <div>
                            <Tooltip content="Details">
                              <button
                                onClick={() => console.log("View", item.id)}
                              >
                                <EyeIcon size={20} fill="#979797" />
                              </button>
                            </Tooltip>
                          </div> */}
                          <div>
                            <Tooltip content="Edit" color="foreground">
                              <button
                                onClick={() =>
                                  router.push(`/master/user/edit/${item.id}`)
                                }
                              >
                                <EditIcon size={20} fill="#52525B" />
                              </button>
                            </Tooltip>
                          </div>
                          <div>
                            <Tooltip content="Delete" color="danger">
                              <button onClick={() => handleDelete(item.id)}>
                                <DeleteIcon size={20} fill="#FF0080" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      );
                      break;
                    default:
                      cellContent = index + 1;
                      break;
                  }

                  return <TableCell>{cellContent}</TableCell>;
                }}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
