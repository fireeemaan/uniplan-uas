import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import chroma from "chroma-js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData }) => {
  return (
    <div className="flex flex-row w-full h-full max-h-[27rem] justify-center">
      <Line
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: "Pengunjung",
              data: chartData.data,
              fill: false,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
        }}
        width={1000}
        height={600}
      />
    </div>
  );
};

const VisitorStat = () => {
  const [visitorData, setVisitorData] = useState([]);

  useEffect(() => {
    console.log("test");
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/statistic.php", {
        params: {
          action: "getAllVisitor",
        },
      })
      .then((response) => {
        const data = response.data.data.visitor;
        console.log(data);
        setVisitorData(data);
      });
  }, []);

  const prepareData = (visitorData) => {
    const groupedData = {};
    visitorData.forEach((item) => {
      const date = new Date(item.time).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = 0;
      }
      groupedData[date]++;
    });
    console.log(groupedData);

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    return { labels, data };
  };

  const chartData = prepareData(visitorData);

  console.log(chartData);

  return (
    <div className="w-full h-full col-span-6 bg-white rounded-xl p-4">
      <Typography
        align="center"
        fontWeight={"bold"}
        variant="h6"
        marginBottom={2}
      >
        Data Pengunjung Website
      </Typography>
      <LineChart chartData={chartData} />
    </div>
  );
};

const PieChart = ({ chartData }) => {
  return (
    <div className="flex flex-row w-full h-full max-h-[27rem] justify-center">
      <Pie
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: "Jumlah Anggota",
              data: chartData.data,
              backgroundColor: chartData.colors,
              borderColor: chartData.colors,
              hoverOffset: 4,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          maintainAspectRatio: false,
        }}
        // width={1000}
        // height={600}
      />
    </div>
  );
};

const MemberChart = ({ dataProdi }) => {
  const [memberData, setMemberData] = useState([]);
  const [ukm, setUkm] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(dataProdi);

  useEffect(() => {
    console.log("test");
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/statistic.php", {
        params: {
          action: "getAllUkmName",
        },
      })
      .then((response) => {
        const data = response.data.data.ukm;
        const labels = data.map((item) => item.ukm_name);
        setAllLabels(labels);
        console.log(data);
        // setUkm(data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/statistic.php", {
        params: {
          action: "getAllUkmMember",
        },
      })
      .then((response) => {
        const data = response.data.data.data_member;
        console.log(data);
        setMemberData(data);
        setLoading(false);
      });
  }, []);

  const generateColorMapping = (labels) => {
    // const colorScale = chroma
    //   .scale(["#3472f7", "#52f765"])
    //   .mode("lch")
    //   .colors(labels.length);

    const randomColors = Array.from({ length: labels.length }, () =>
      chroma.random().css()
    );

    const colorMapping = {};
    labels.forEach((label, index) => {
      colorMapping[label] = randomColors[index];
    });
    return colorMapping;
  };

  const prepareData = (memberData) => {
    if (loading || !memberData.length || !allLabels.length) {
      return { prodi: "", labels: [], data: [], colors: [] };
    }

    const groupedData = {};
    memberData.forEach((item) => {
      const prodi = item.prodi;
      const ukm = item.ukm;
      if (!groupedData[prodi]) {
        groupedData[prodi] = {};
      }
      if (!groupedData[prodi][ukm]) {
        groupedData[prodi][ukm] = 0;
      }
      groupedData[prodi][ukm]++;
    });

    console.log(groupedData);

    const colorMapping = generateColorMapping(allLabels);
    console.log(colorMapping);

    const prodi = dataProdi;
    const labels = Object.keys(groupedData[dataProdi]);
    const data = Object.values(groupedData[dataProdi]);
    const colors = labels.map((label) => colorMapping[label]);

    return { prodi, labels, data, colors };
  };

  const chartData = prepareData(memberData);

  console.log(chartData);

  return <PieChart chartData={chartData} />;
};

const Statistik = () => {
  return (
    <div className="grid grid-cols-6 grid-rows-3 gap-4 grid-flow-row w-full rounded-lg justify-center items-center">
      <VisitorStat />
      <div className="w-full h-full col-span-2 bg-white p-5 rounded-lg shadow-lg">
        <Typography
          align="center"
          fontWeight={"bold"}
          variant="h6"
          marginBottom={2}
        >
          Sistem Informasi
        </Typography>
        <MemberChart dataProdi="Sistem Informasi" />
      </div>
      <div className="w-full h-full col-span-2 bg-white p-5 rounded-lg shadow-lg">
        <Typography
          align="center"
          fontWeight={"bold"}
          variant="h6"
          marginBottom={2}
        >
          Teknologi Informasi
        </Typography>
        <MemberChart dataProdi="Teknologi Informasi" />
      </div>
      <div className="w-full h-full col-span-2 bg-white p-5 rounded-lg shadow-lg">
        <Typography
          align="center"
          fontWeight={"bold"}
          variant="h6"
          marginBottom={2}
        >
          Informatika
        </Typography>
        <MemberChart dataProdi="Informatika" />
      </div>
    </div>
  );
};

export default Statistik;
