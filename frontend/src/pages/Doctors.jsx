import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || "");
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  // ✅ Speciality list
  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  // ✅ Apply filter when speciality changes
  const applyFilter = () => {
    if (selectedSpeciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === selectedSpeciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, selectedSpeciality]);

  return (
    <div className="flex gap-6 p-4">
      {/* -------- LEFT SIDE FILTER -------- */}
      <div className="w-1/4 border-r pr-4">
        <h2 className="text-xl font-semibold mb-4">Specialities</h2>
        <ul className="space-y-3">
          {specialities.map((spec) => (
            <li
              key={spec}
              onClick={() => setSelectedSpeciality(spec)}
              className={`cursor-pointer p-2 rounded-lg border ${
                selectedSpeciality === spec
                  ? "bg-blue-500 text-white border-blue-500"
                  : "hover:bg-blue-100 border-gray-300"
              }`}
            >
              {spec}
            </li>
          ))}
          {/* ✅ Show all doctors option */}
          <li
            onClick={() => setSelectedSpeciality("")}
            className={`cursor-pointer p-2 rounded-lg border ${
              selectedSpeciality === ""
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-blue-100 border-gray-300"
            }`}
          >
            Show All
          </li>
        </ul>
      </div>

      {/* -------- RIGHT SIDE DOCTORS LIST -------- */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">
          {selectedSpeciality ? `${selectedSpeciality}s` : "All Doctors"}
        </h1>

        <div className="grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.length > 0 ? (
            filterDoc.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-6px] transition-all duration-500"
              >
                <img
                  className="bg-blue-50 w-full object-contain rounded-t-xl"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-green-500 animate-blink">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No doctors available for this speciality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
