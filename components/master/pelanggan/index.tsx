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
  Form
} from "@heroui/react";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EditIcon } from "../../icons/table/edit-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Select from 'react-select';
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";


interface Pelanggan {
  ID: number;
  PERSONNO: string
  NAME: string
  PHONE1: string
  PHONE2: string
  CONTACT: string
}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export const Pelanggan = () => {
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(true);
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)


  useEffect(() => {

    fetchData();
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("pelanggan.read");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PELANGGAN_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status == 200) {
        setPelanggan(result.data || []);
      } else if (result.status == 403 || result.status == 401) {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setPelanggan([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {

    fetchData();
  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Pelanggan" },
    { label: "List" },
  ];

  const [formValues, setFormValues] = useState({
    PERSONNO: "",
    NAME: "",
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

  const filteredPelanggan = React.useMemo(() => {
    return pelanggan.filter((rm) => {
      const matchesPersonNo = formValues.PERSONNO
        ? rm.PERSONNO
          .toLowerCase()
          .includes(formValues.PERSONNO.toLowerCase())
        : true;

      const matchesName = formValues.NAME
        ? rm.NAME
          .toLowerCase()
          .includes(formValues.NAME.toLowerCase())
        : true;


      return matchesName && matchesPersonNo;
    });
  }, [pelanggan, formValues]);

  const pages =
    filteredPelanggan.length > 0
      ? Math.ceil(filteredPelanggan.length / rowsPerPage)
      : 1;

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const shortingRow = React.useMemo(() => {
    const data = [...filteredPelanggan];
    const { column, direction } = sortDescriptor;


    data.sort((a, b): any => {
      const aValue = getNestedValue(a, column);
      const bValue = getNestedValue(b, column);

      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
    });

    return data;
  }, [filteredPelanggan, sortDescriptor]);

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

  const handleSelectChange = (selectedOption, { name }) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const resetForm = () => {
    setFormValues({
      PERSONNO: "",
      NAME: "",
    });
  };

  const handleDelete = (id: any) => {
    swal({
      title: "Apakah Anda yakin?",
      text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
      icon: "warning",
      buttons: ["Cancel", "OK"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (navigator.onLine) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_PELANGGAN_DELETE_URL_API}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${token}`,
            }
          })
          const result = await response.json()
          if (result.status && result.message) {
            if (result.status == 200) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });

              fetchData()
            } else {
              toast.error(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
            }
          } else {
            toast.error('Terjadi kesalahan pada sistem !', {
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
          <Card className="max-full">
            <CardBody>
              <Form className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
                <Input
                  type="text"
                  labelPlacement="outside"
                  label="No Pelanggan"
                  name="PERSONNO"
                  placeholder="Enter no pelanggan"
                  color="default"
                  radius="sm"
                  variant="bordered"
                  className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                  value={formValues.PERSONNO}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  labelPlacement="outside"
                  label="Nama Pelanggan"
                  name="NAME"
                  placeholder="Enter nama pelanggan"
                  color="default"
                  radius="sm"
                  variant="bordered"
                  className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                  value={formValues.NAME}
                  onChange={handleChange}
                />
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
              </Form>
            </CardBody>
            {/* <CardFooter>
        </CardFooter> */}
          </Card>

          {/* <Divider /> */}
          <div className="flex justify-between flex-wrap gap-4 items-center">
            <h3 className="text-xl font-semibold">All Pelanggan</h3>
            <div className="flex flex-row gap-3.5 flex-wrap">
              <Button
                size="md"
                color="primary"
                onClick={() => router.push("/master/pelanggan/create")}
              >
                Add Pelanggan
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
                <TableColumn key="PERSONNO" allowsSorting>
                  NO PELANGGAN
                </TableColumn>
                <TableColumn key="NAME" allowsSorting>
                  NAMA PELANGGAN
                </TableColumn>
                <TableColumn key="PHONE1" allowsSorting>
                  TELEPON
                </TableColumn>
                <TableColumn key="PHONE2" allowsSorting>
                  HANDPHONE
                </TableColumn>
                <TableColumn key="CONTACT" allowsSorting>
                  KONTAK
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
                  <TableRow key={item.ID}>
                    {(columnKey) => {
                      let cellContent;

                      switch (columnKey) {
                        case "NAME":
                          cellContent = item.NAME;
                          break;
                        case "PERSONNO":
                          cellContent = item.PERSONNO;
                          break;
                        case "PHONE1":
                          cellContent = item.PHONE1;
                          break;
                        case "PHONE2":
                          cellContent = item.PHONE2;
                          break;
                        case "CONTACT":
                          cellContent = item.CONTACT;
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
                                      router.push(
                                        `/master/pelanggan/edit/${item.ID}`
                                      )
                                    }
                                  >
                                    <EditIcon size={20} fill="#52525B" />
                                  </button>
                                </Tooltip>
                              </div>
                              <div>
                                <Tooltip
                                  content="Delete"
                                  color="danger"
                                >
                                  <button onClick={() => handleDelete(item.ID)}>
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
