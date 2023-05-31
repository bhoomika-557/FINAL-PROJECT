import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { URL } from "../../constants/config";
const StudentDetails = () => {
  const [student, setStudent] = useState({});
  const { auth } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get(URL + `/students/details/${auth.EMAIL}`);
    const data = await result?.data?.student_details;
    setStudent(data);
  };
  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h3 className="text-xl font-bold mb-4">Student Details</h3>
      <ul className="list-disc mb-4">
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Registration Number</strong>
            <div className="w-7">:</div>
            <div>{student?.REG_NO}</div>
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Student Name</strong>
            <div className="w-7">:</div>
            <div>{student?.NAME_OF_THE_STUDENT}</div>
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Gender</strong>
            <div className="w-7">:</div>
            {student?.GENDER}
          </div>
        </li>
        {/* <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">College</strong>
            <div className="w-7">:</div>
            {student?.COLLEGE}
          </div>
        </li> */}
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Branch</strong>
            <div className="w-7">:</div>
            {student?.BRANCH}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Email</strong>
            <div className="w-7">:</div>
            {student?.EMAIL}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Mobile</strong>
            <div className="w-7">:</div>
            {student?.MOBILE}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Address</strong>
            <div className="w-7">:</div>
            {student?.ADDRESS}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Academic Year</strong>
            <div className="w-7">:</div>
            {student?.ACADEMIC_YEAR}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">No.of Offers</strong>
            <div className="w-7">:</div>
            {student?.NO_OF_OFFERS}
          </div>
        </li>
        {/* <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Highest Package</strong>
            <div className="w-7">:</div>
            {student?.HIGHEST_PACKAGE}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Lowest Package</strong>
            <div className="w-7">:</div>
            {student?.LOWEST_PACKAGE}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Highest Package Company </strong>
            <div className="w-7">:</div>
            {student?.HIGHEST_PACKAGE_COMPANY}
          </div>
        </li>
        <li className="p-1">
          <div className="flex flex-row max-w-full">
            <strong className="w-44">Lowest Package Company </strong>
            <div className="w-7">:</div>
            {student?.LOWEST_PACKAGE_COMPANY}
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default StudentDetails;
