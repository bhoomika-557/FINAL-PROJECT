import React, { lazy, Suspense } from "react";

import CompanyList from "../pages/Company/CompanyList";
import AllPlacementStudents from "../pages/Student/AllPlacementStudents";
import CompanyWiseSelected from "../pages/Company/CompanyWiseSelected";
import StudentSelectedCompaniesList from "../pages/Student/StudentSelectedCompaniesList";
import Login from "../pages/Login/Login";
import FileUpload from "../pages/FileUpload/FileUploadComponent";
import PlacementSheet from "../pages/PlacementSheet/PlacementSheet";
import Departmentwiselist from "../pages/Department/Departmentwiselist";
import EachDepartment from "../pages/Department/BranchWiseStudents";

import RequireAuth from "../components/RequireAuth";
import { Outlet, Route, Routes } from "react-router-dom";

import DetailsComponent from "../pages/Student/StudentDetails";

const ROLES = {
  STAFF: "STAFF",
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        {/* public */}
        <Route path="login" element={<Login />} />
        {/* private */}
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route path="file-upload" element={<FileUpload />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route path="company-list" element={<CompanyList />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route
            path="company-wise-selected/:company"
            element={<CompanyWiseSelected />}
          />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route
            path="all-placement-students"
            element={<AllPlacementStudents />}
          />
        </Route>
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.STAFF, ROLES.ADMIN, ROLES.STUDENT]}
            />
          }
        >
          <Route
            path="students/:regNo"
            element={<StudentSelectedCompaniesList />}
          />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route path="placement-sheet" element={<PlacementSheet />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route path="departmentwise" element={<Departmentwiselist />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
        >
          <Route
            path="each-department-selected/:department"
            element={<EachDepartment />}
          />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="details" element={<DetailsComponent />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
