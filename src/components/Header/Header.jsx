import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ColorModeContext } from "../../ThemeProviderWrapper";
import authService from "../../appwrite/auth";
import appService from "../../appwrite/service";
import { logout as logoutAction } from "../../store/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const location = useLocation().pathname;

  // Pull username + avatar file ID out of Redux
  const userName = auth.userData?.name;
  const userPhotoId = auth.userData?.prefs?.profileImage;

  // Load avatar URL after ensuring appService.storage is initialized
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadAvatar = async () => {
      try {
        // Defensive: ensure storage is available and method exists
        if (
          appService &&
          appService.storage &&
          typeof appService.getFileView === "function"
        ) {
          const url = appService.getFileView(userPhotoId);
          if (mounted) setUserPhotoUrl(url || null);
        } else {
          // storage not ready yet
          if (mounted) setUserPhotoUrl(null);
        }
      } catch (err) {
        console.error("getFileView error", err);
        if (mounted) setUserPhotoUrl(null);
      }
    };

    if (userPhotoId) loadAvatar();
    else setUserPhotoUrl(null);

    return () => {
      mounted = false;
    };
  }, [userPhotoId]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Build nav links depending on auth.status
  const links = [
    { label: "Home", path: "/" },
    ...(auth.status
      ? [
          { label: "All Posts", path: "/all-posts" },
          { label: "Add Post", path: "/add-post" },
        ]
      : [
          { label: "Login", path: "/login" },
          { label: "Signup", path: "/signup" },
        ]),
  ];

  return (
    <AppBar position="fixed" elevation={4}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">NeevBlogs</Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Theme toggle */}
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>

          {/* Nav links */}
          {links.map(({ label, path }) => (
            <Button
              key={path}
              component={NavLink}
              to={path}
              end={path === "/"}
              sx={{
                color: "inherit",
                bgcolor: location === path ? "primary.light" : "transparent",
              }}
            >
              {label}
            </Button>
          ))}

          {/* If logged in, show avatar, name, logout */}
          {auth.status && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                src={userPhotoUrl || undefined}
                alt={userName}
                sx={{ width: 32, height: 32 }}
              >
                {!userPhotoUrl && userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle2">{userName}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
