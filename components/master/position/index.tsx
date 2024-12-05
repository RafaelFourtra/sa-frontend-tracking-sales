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
} from "@nextui-org/react";
import React from "react";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EditIcon } from "../../icons/table/edit-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce  } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import NProgress from "nprogress";
import "nprogress/nprogress.css";


interface Position {
    id: number;
    position: string;
}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export const Position = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<Position[]>([]); 

  const fetchData = async () => {
    try {
      NProgress.set(0.4);
      const response = await fetch(`${process.env.NEXT_PUBLIC_POSITION_DATATABLE_URL_API}`, { cache: 'no-store' });
      const data = await response.json();
      setPosition(data.data || []); 
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setPosition([]); 
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Position" },
    { label: "List" },
  ];

  const [formValues, setFormValues] = useState({
    position: "",
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

  const filteredPosition = React.useMemo(() => {
    return position.filter((position) => {
      const matchesPosition = formValues.position
        ? position.position
            .toLowerCase()
            .includes(formValues.position.toLowerCase())
        : true;

      return matchesPosition;
    });
  }, [position, formValues]);

  const pages =
    filteredPosition.length > 0
      ? Math.ceil(filteredPosition.length / rowsPerPage)
      : 1;

  const shortingRow = React.useMemo(() => {
    const data = [...filteredPosition];
    const { column, direction } = sortDescriptor;

    data.sort((a, b): any => {
      if (a[column as keyof typeof a] < b[column as keyof typeof a])
        return direction == "ascending" ? -1 : 1;
      if (a[column as keyof typeof a] > b[column as keyof typeof a])
        return direction == "ascending" ? 1 : -1;
    });

    return data;
  }, [filteredPosition, sortDescriptor]);

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

  const resetForm = () => {
    setFormValues({
      position: "",
    });
  };

  const handleDelete = (id :any) => {
    console.log('sa')
    swal({
      title: "Apakah Anda yakin?",
      text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (navigator.onLine) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_POSITION_DELETE_URL_API}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          const result = await response.json()
          if(result.status && result.message) {
            if(result.status == 200){
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              
              fetchData()
            } else {
              toast.error('Terjadi kesalahan pada sistem !', {
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
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer/>
      <Card className="max-full">
        <CardBody>
          <form>
            <div className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
              <Input
                type="text"
                labelPlacement="outside"
                label="Position"
                name="position"
                placeholder="Enter position"
                color="default"
                radius="sm"
                variant="bordered"
                className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                value={formValues.position}
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
            </div>
          </form>
        </CardBody>
        {/* <CardFooter>
      </CardFooter> */}
      </Card>

      {/* <Divider /> */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">All Position</h3>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button size="md" color="primary" onClick = {() => router.push('/master/position/create')}>
            Add Position
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
            <TableColumn key="position" allowsSorting>
              POSITION
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
                    case "position":
                      cellContent = item.position;
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
                                onClick={() => router.push(`/master/position/edit/${item.id}`)}
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