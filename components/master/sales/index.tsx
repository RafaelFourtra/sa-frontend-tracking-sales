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
  import Select from 'react-select';
  import Cookies from "js-cookie";

  interface SalesMan {
    SALESMANID: string;
    SALESMANNAME: string;
  }

  interface Sales {
    ID: number;
    NAME: string;
    SALESMANID: string;
    SalesMan: SalesMan;
  }

  type SortDirection = "ascending" | "descending";

  interface SortDescriptor {
    column: string;
    direction: SortDirection;
  }

  export const Sales = () => {
    const router = useRouter();
    const token = Cookies.get("auth_token");
    const [isLoading, setIsLoading] = useState(true);
    const [sales, setSales] = useState<Sales[]>([]);
    const [salesMan, setSalesMan] = useState([]);


    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SALES_DATATABLE_URL_API}`,
          { 
            cache: "no-store", 
            headers: {
            "Authorization": `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status == 200) {
          setSales(result.data || []); 
        } else if(result.status == 403 || result.status == 401) {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
        }

        const responseDataSalesman = await fetch(
          `${process.env.NEXT_PUBLIC_SALESMAN_DATATABLE_URL_API}`,
           { 
              cache: "no-store", 
              headers: {
              "Authorization": `Bearer ${token}`,
              },
           }
        )
    
        const dataSalesMan = await responseDataSalesman.json()
        if(dataSalesMan.status && dataSalesMan.status == 200) {
          const formattedSalesman = dataSalesMan.data.map((salesman :any) => ({
            label: salesman.SALESMANNAME,  
            value: salesman.SALESMANNAME    
          }));
          setSalesMan(formattedSalesman || [])
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setSales([]);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const breadcrumbItems = [
      { label: "Home" },
      { label: "Master" },
      { label: "Sales" },
      { label: "List" },
    ];

    const [formValues, setFormValues] = useState({
      NAME: "",
      SALESMAN: "",
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

    const filteredSales = React.useMemo(() => {
      return sales.filter((rm) => {
        const matchesName= formValues.NAME
          ? rm.NAME
              .toLowerCase()
              .includes(formValues.NAME.toLowerCase())
          : true;

        const matchesPenjual= formValues.SALESMAN
          ? rm.SalesMan?.SALESMANNAME === formValues.SALESMAN
          : true;


        return matchesName && matchesPenjual;
      });
    }, [sales, formValues]);

    const pages =
      filteredSales.length > 0
        ? Math.ceil(filteredSales.length / rowsPerPage)
        : 1;

    const getNestedValue = (obj: any, path: string): any => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
      
    const shortingRow = React.useMemo(() => {
      const data = [...filteredSales];
      const { column, direction } = sortDescriptor;
  
     
      data.sort((a, b): any => {
        const aValue = getNestedValue(a, column);
        const bValue = getNestedValue(b, column);
    
        if (aValue < bValue) return direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      });
  
      return data;
    }, [filteredSales, sortDescriptor]);

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
      console.log
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: selectedOption ? selectedOption.value : '',
      }));
    };

    const resetForm = () => {
      setFormValues({
        NAME: "",
        SALESMAN: "",
      });
    };

    const handleDelete = (id :any) => {
      swal({
        title: "Apakah Anda yakin?",
        text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          if (navigator.onLine) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SALES_DELETE_URL_API}${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
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

    return (
      <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
        <Breadcrumb items={breadcrumbItems} />
        <ToastContainer/>
        <Card className="max-full">
          <CardBody>
            <Form className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
                <Input
                  type="text"
                  labelPlacement="outside"
                  label="Sales"
                  name="NAME"
                  placeholder="Enter sales"
                  color="default"
                  radius="sm"
                  variant="bordered"
                  className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                  value={formValues.NAME}
                  onChange={handleChange}
                />
                <div>
                <h3 className="text-sm -mt-1">Penjual</h3>
               <Select
                  className="text-sm basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a penjual"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="SALESMAN"
                  value={salesMan.find(option => option.value === formValues.SALESMAN) || null} 
                  options={salesMan}
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
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                      fontSize: '0.875rem'
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
            </Form>
          </CardBody>
          {/* <CardFooter>
        </CardFooter> */}
        </Card>

        {/* <Divider /> */}
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <h3 className="text-xl font-semibold">All Sales</h3>
          <div className="flex flex-row gap-3.5 flex-wrap">
            <Button
              size="md"
              color="primary"
              onClick={() => router.push("/master/sales/create")}
            >
              Add Sales
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
              <TableColumn key="NAME" allowsSorting>
                SALES
              </TableColumn>
              <TableColumn key="SalesMan.SALESMANNAME" allowsSorting>
                PENJUAL
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
                      case "SalesMan.SALESMANNAME":
                        cellContent = item.SalesMan?.SALESMANNAME;
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
                                      `/master/sales/edit/${item.ID}`
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
