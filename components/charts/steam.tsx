import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Cookies from "js-cookie";
import { ApexOptions } from "apexcharts";

export const Steam = () => {
  const token = Cookies.get("auth_token");

  const [chartData, setChartData] = useState<{
    options: ApexOptions;
    series: any[];
  }>({
    options: {
      chart: {
        type: "area",
        animations: {
          easing: "linear",
          speed: 300,
        },
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'], 
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#333",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#333",
          },
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
      },
      grid: {
        borderColor: "#e7e7e7",
        padding: {
          right: 30,
          left: 20
        }
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1,
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      dataLabels: {
        enabled: false
      }
    },
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DASHBOARD_VISIT_LAST_WEEK_DATATABLE_URL_API}`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          const { data } = result;

    
          const uniqueDates = Array.from(new Set(data.map(item => item.TANGGAL))).sort();
          const uniqueKeterangan = Array.from(new Set(data.map(item => item.KETERANGAN)));


          const series = uniqueKeterangan.map(keterangan => {
            const seriesData = uniqueDates.map(date => {
              const matchingItem = data.find(item => 
                item.TANGGAL === date && item.KETERANGAN === keterangan
              );
              return matchingItem ? matchingItem.jumlah : 0;
            });

            return {
              name: keterangan,
              data: seriesData
            };
          });

          setChartData(prev => ({
            options: {
              ...prev.options,
              xaxis: {
                ...prev.options.xaxis,
                categories: uniqueDates
              }
            },
            series: series
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="w-full z-20">
      <div id="chart">
        <Chart 
          options={chartData.options} 
          series={chartData.series} 
          type="area" 
          height={425} 
        />
      </div>
    </div>
  );
};

export default Steam;