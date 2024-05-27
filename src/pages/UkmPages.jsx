import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const UkmPages = () => {
  const { name } = useParams();

  const ukmData = JSON.parse(sessionStorage.getItem("ukm"));
  let ukmName = "";

  const findUkm = ukmData.find((ukm) => ukm.singkatan.toLowerCase() === name);

  if (findUkm) {
    ukmName = findUkm.singkatan;
  }

  useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-slate-200 h-full m-5">
        <h1 className="text-4xl font-semibold text-center text-slate-900">
          {ukmName}
        </h1>
      </div>
    </div>
  );
};

export default UkmPages;
