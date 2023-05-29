import React, { useState, useMemo, useEffect, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import InfoIcon from "@mui/icons-material/Info";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { Outlet, useNavigate } from "react-router-dom";
import { Add, Home, Search } from "@mui/icons-material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Departmentwiselist from "../pages/Department/Departmentwiselist";
import Autocompletebox from "../components/autocomplete";
import { setAcademicYearHeaders } from "../interceptor/interceptor";
import useAuth from "../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const autocomp = {};
export default function MiniDrawer() {
  const { setAcademicYear, auth } = useAuth();
  // console.log("auth", auth);
  const studentItems = [
    {
      label: "About",
      route: `/details`,
      icon: <InfoIcon />,
    },
    {
      label: "Selected Companies",
      route: `/students/${auth?.EMAIL}`,
      icon: <GroupWorkIcon />,
    },
  ];
  const navItems = [
    { label: "File Upload", route: "/file-upload", icon: <FileUploadIcon /> },
    // auth.ROLE === "ADMIN" && {
    //   label: "File Upload",
    //   route: "/file-upload",
    //   icon: <FileUploadIcon />,
    // },
    { label: "Company List", route: "/company-list", icon: <ListAltIcon /> },

    {
      label: "Placed Students",
      route: "/all-placement-students",
      icon: <PersonIcon />,
    },
    {
      label: "ASGI Placements",
      route: "/placement-sheet",
      icon: <GroupIcon />,
    },
    {
      label: "Departmentwise",
      route: "/departmentwise",
      icon: <GroupWorkIcon />,
    },
  ];
  const hodItems = [
    { label: "Company List", route: "/company-list", icon: <ListAltIcon /> },

    {
      label: "Placed Students",
      route: "/all-placement-students",
      icon: <PersonIcon />,
    },
    {
      label: "ASGI Placements",
      route: "/placement-sheet",
      icon: <GroupIcon />,
    },
    {
      label: "Departmentwise",
      route: "/departmentwise",
      icon: <GroupWorkIcon />,
    },
  ];
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const yearRanges = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearRanges = [];

    for (let i = 0; i < 26; i++) {
      const startYear = currentYear - i;
      const endYear = startYear - 1;
      const yearRange = `${endYear}-${startYear}`;
      yearRanges.push(yearRange);
    }

    return yearRanges;
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    setAcademicYearHeaders(yearRanges[0]);
  }, []);

  const autoCompleteRef = useRef();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="topnav">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex">
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontSize: "30px" }}
              >
                Placement Management System
              </Typography>
            </div>

            <div className="flex">
              {(auth.ROLE === "ADMIN" || auth.ROLE === "STAFF") && (
                <Autocompletebox
                  className={"autocomp"}
                  defaultValue={yearRanges[0]}
                  sx={{ fontSize: "30px", padding: "2px" }}
                  options={yearRanges}
                  style={{ width: 200 }}
                  handler={(event, value) => {
                    setAcademicYearHeaders(value || yearRanges[0]);
                    setAcademicYear(value || yearRanges[0]);
                  }}
                />
              )}

              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleLogout}
                edge="start"
                sx={{
                  ...(open && { display: "none" }),
                }}
                className="!mx-2"
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        {auth.ROLE === "ADMIN" && (
          <List>
            {navItems.map((element, index) => (
              <ListItem
                key={element.label}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => navigate(element.route)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {element.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={element.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {auth.ROLE === "STAFF" && (
          <List>
            {hodItems.map((element, index) => (
              <ListItem
                key={element.label}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => navigate(element.route)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {element.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={element.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {auth.ROLE === "STUDENT" && (
          <List>
            {studentItems.map((element, index) => (
              <ListItem
                key={element.label}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => navigate(element.route)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {element.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={element.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
