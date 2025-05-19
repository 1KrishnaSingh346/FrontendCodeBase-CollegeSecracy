import { useParams, Outlet } from "react-router-dom";

 const DashboardLayout = () => {
  const { dashboardType } = useParams();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
