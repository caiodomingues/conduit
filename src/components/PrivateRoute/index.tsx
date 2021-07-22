import { ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../utils/AuthContext";

interface PrivateRouteProps {
  component: ReactNode;
  path: string;
}

function PrivateRoute({ path, component }: PrivateRouteProps) {
  const { signed } = useAuth();

  return (
    <>
      {signed ? (
        <Route path={path}>{component}</Route>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}

export default PrivateRoute;
