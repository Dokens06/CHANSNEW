import ProtectedRoute from "../../routes/ProtectedRoute"
import DashboardContainer from "./DashboardContainer"

const DashboardPage = () => {
    return (
        <DashboardContainer />
    )
}

const ProtectedDashboardPage = ProtectedRoute(DashboardPage);

export default ProtectedDashboardPage