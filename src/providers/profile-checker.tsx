"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { quitProfile } from "./redux/profile-slice";
import { logout } from "./redux/user-slice";

function ProfileCheckerProvider({ children }: { children: React.ReactNode }) {
  // PROFILE MANAGMENT
  const dispatch = useDispatch();

  useEffect(() => {
    const checkCurrentProfile = () => {
      if (!Cookies.get("currentProfile")) {
        dispatch(quitProfile());
      }
    };
    checkCurrentProfile();
  }, [dispatch]);

  // USER MANAGEMENT
  useEffect(() => {
    const checkCurrentUser = () => {
      if (!Cookies.get("access_token")) {
        dispatch(logout());
      }
    };
    checkCurrentUser();
  }, [dispatch]);

  return <div>{children}</div>;
}

export default ProfileCheckerProvider;
