import { Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookieHelper";

const PublicRoute = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const isAuthenticated = !!getCookie("access_token");

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithProtection.displayName = `Public(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default PublicRoute;