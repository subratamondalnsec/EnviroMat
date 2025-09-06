// This component ensures pickers have complete profiles before accessing protected routes
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants.jsx";
import { isPickerProfileComplete } from "../../../utils/profileUtils.js";
import ProfileCheckLoadingPage from "../../common/ProfileCheckLoadingPage.jsx";

function PickerProtectedRoute({ children }) {
  const { token, loading } = useSelector((state) => state.auth);
  const { user, loading: profileLoading } = useSelector((state) => state.profile);

  // If still loading, show loading page
  if (loading || profileLoading) {
    return <ProfileCheckLoadingPage />;
  }

  // If not authenticated, redirect to login
  if (token === null) {
    return <Navigate to="/login" />;
  }

  // If not a picker, allow access (this component is only for picker routes)
  if (user?.accountType !== ACCOUNT_TYPE.PICKER) {
    return children;
  }

  // For pickers, check if profile is complete
  if (user?.accountType === ACCOUNT_TYPE.PICKER && !isPickerProfileComplete(user)) {
    return <Navigate to="/picker-edit-profile" replace />;
  }

  return children;
}

export default PickerProtectedRoute;
