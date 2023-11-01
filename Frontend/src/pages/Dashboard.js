import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesstate, setSalesState] = useState({
    good: 0,
    normal: 0,
    bad: 0
  });

  const [manufacturerdata, setManufacturerdata] = useState({});
  const [doughnutBackground, setDoughnutBackground] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState({});

  // data for bar plot
  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "monthly-sales",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [],
      },
    ],
  });

  // data for doughnut plot
  const data = {
    labels: Object.keys(manufacturerdata),
    datasets: [
      {
        data: Object.values(manufacturerdata),
        backgroundColor: doughnutBackground,
        borderWidth: 1,
      },
    ],
  };

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);

  // Set the background colors of the doughnut chart as random
  const getRandomRGBA = () => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var a = 0.4;
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  }
  
  const generateRandomColorsArray = (count) => {
    var colors = [];
    for (var i = 0; i < count; i++) {
      colors.push(getRandomRGBA());
    }
    return colors;
  }

  // Fetching total sales amount
  const fetchTotalSaleAmount = () => {
    fetch(
      'http://localhost:4000/api/sales/totalsalesamount',
      {method: 'POST'},
    )
      .then((res) => res.json())
      .then((res) => {
        setSaleAmount(res.total);
        setSalesState({
          good: res.good,
          normal: res.normal,
          bad: res.bad
        });
      });
  };

  // Fetching total purchase amount
  const fetchTotalPurchaseAmount = () => {
    fetch(
      'http://localhost:4000/api/purchase/totalpurchaseamount',
      {method: 'POST'},
    )
      .then((res) => res.json())
      .then((res) => setPurchaseAmount(res.totalPurchaseAmount));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch('http://localhost:4000/api/product/get',
    {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((res) => {
        // adjust response for chart drawing
        const manufacturerdata = res.reduce((counts, car) => {
          counts[car.manufacturer] = (counts[car.manufacturer] || 0) + 1; 
          return counts
        }, {});
        setDoughnutBackground(generateRandomColorsArray(Object.keys(manufacturerdata).length));
        setManufacturerdata(manufacturerdata);
        setProducts(res);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    fetch('http://localhost:4000/api/sales/getmonthly',
    {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((res) => {
        setMonthlySalesData(res);
        updateChartData(res['2023']);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-span-12 lg:col-span-10 justify-center">

      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 lg:grid-cols-3  p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">
          <div>
            <strong className="block text-sm font-medium text-gray-500 mb-3">
              Sales
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                $ {saleAmount}
              </span>

              <span className="font-medium ml-3 inline-flex gap-2 self-end rounded bg-pink-100 px-3">{salesstate.bad}</span>
              <span className="font-medium ml-3 inline-flex gap-2 self-end rounded bg-yellow-100 px-3">{salesstate.normal}</span>
              <span className="font-medium ml-3 inline-flex gap-2 self-end rounded bg-green-100 px-3">{salesstate.good}</span>
            </p>
          </div>
        </article>
        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div>
            <strong className="block text-sm font-medium text-gray-500 mb-3">
              Total Expense
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                $ {purchaseAmount}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div>
            <strong className="block text-sm font-medium text-gray-500 mb-3">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {products.length}{" "}
              </span>
              <span className="font-medium ml-3 inline-flex gap-2 self-end rounded bg-green-100 px-3">on sale: {products.filter(x => x.state === 'on sale').length}</span>
              <span className="font-medium ml-3 inline-flex gap-2 self-end rounded bg-slate-100 px-3">not on sale: {products.filter(x => x.state === 'not on sale').length}</span>
            </p>
          </div>
        </article>
      </div>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 lg:grid-cols-2  p-4 ">
        <div className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">

          <div>
            <div className="mb-3 text-l">
            <span>
              Sales of This Year:
              <span className="ml-5 text-2xl">
                ${chart.series[0].data.reduce((sum, a) => sum + a, 0)}
              </span>
            </span>
            </div>
            <div>
              <select  onChange={(e) => updateChartData(monthlySalesData[e.target.value])}>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
              </select>
            </div>
          </div>
          <div>
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
          />
          </div>
        </div>
        <div className="flex content-center flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="w-3/4">
          <Doughnut data={data} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
