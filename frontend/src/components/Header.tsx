//import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import Logo from "./shared/Logo";
import NavigationLink from "./shared/NavigationLink";
import { useAuth } from "../context/AuthProvider";
export default function Header() {
  const auth = useAuth();

  return (
    <AppBar
      sx={{
        bgcolor: "transparent",
        position: "static",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Logo />
        <div>
          <>
            {auth?.isLoggedIn ? (
              <>
                <NavigationLink
                  to="/chat"
                  bg="#00fffc"
                  text="Go To Chat"
                  textColor="black"
                />
                <NavigationLink
                  to="/"
                  bg="#51538f"
                  text="Logout"
                  textColor="white"
                  onClick={auth?.logout}
                />
              </>
            ) : (
              <>
                <NavigationLink
                  to="/login"
                  bg="#00fffc"
                  text="Login"
                  textColor="black"
                />
                <NavigationLink
                  to="/signup"
                  bg="#51538f"
                  text="Signup"
                  textColor="white"
                />
              </>
            )}
          </>
        </div>
      </Toolbar>
    </AppBar>
  );
}
