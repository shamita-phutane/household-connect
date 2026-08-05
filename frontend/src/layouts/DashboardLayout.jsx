import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function DashboardLayout() {

    return (
        <>
            <Navbar />

            <Outlet />
        </>
    );

}

export default DashboardLayout;