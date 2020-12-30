import React from "react";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import AppsIcon from "@material-ui/icons/Apps";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";

// Auth0
import { useAuth0 } from "@auth0/auth0-react";

// React Router
import { Link, useHistory } from "react-router-dom";

// CSS
import "./HorizontalNav4.css";

// Custom Components
import LogInButton from "../Login/LogInButton/LogInButton";
import LogOutButton from "../Login/LogOutButton/LogOutButton";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  linkBrand: {
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  linkBrandSmall: {
    display: "none",
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      display: "inline-block",
    },
  },
  drawerContainer: {
    width: 256,
  },
}));

export default function Navigation(props) {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  console.log(isAuthenticated);

  const history = useHistory();
  const classes = useStyles();

  const content = {
    brand: { image: "mui-assets/img/logo-pied-piper-white.png", width: 120 },
    "brand-small": {
      image: "mui-assets/img/logo-pied-piper-white-icon.png",
      width: 32,
    },
    link1: "Features",
    link2: "Enterprise",
    link3: "Support",
    link4: "ICO",
    avatar: "",
    ...props.content,
  };

  // Add avatar, if present
  if (user?.picture) {
    content.avatar = user.picture;
  }

  const [state, setState] = React.useState({ open: false });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, open });
  };

  return (
    <AppBar position="static">
      <Toolbar className="bar">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <div className="link-container">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/rituals" className="nav-link">
            Rituals
          </Link>
          <Link to="/rituals/standup" className="nav-link">
            Stand Up
          </Link>
          <Link to="/rituals/retro" className="nav-link">
            Retro
          </Link>
        </div>

        <div className="navbarUserSection">
          {isAuthenticated ? <LogOutButton /> : <LogInButton />}
          <Link to={isAuthenticated ? "/user" : null}>
            <IconButton
              color="inherit"
              className="avatar"
              onClick={isAuthenticated ? null : () => loginWithRedirect()}
            >
              <Avatar alt="User Avatar" src={content["avatar"]} />
            </IconButton>
          </Link>
        </div>
      </Toolbar>

      <Drawer anchor="left" open={state.open} onClose={toggleDrawer(false)}>
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              button
              onClick={() => {
                history.replace("/home");
                document.location.reload();
              }}
              key={content["link1"]}
            >
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={content["link1"]} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                history.replace("/rituals/standup");
                document.location.reload();
              }}
              key={content["link2"]}
            >
              <ListItemIcon>
                <BusinessCenterIcon />
              </ListItemIcon>
              <ListItemText primary={content["link2"]} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </AppBar>
  );
}