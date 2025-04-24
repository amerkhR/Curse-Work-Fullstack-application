import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Help from "./components/help.component";
import Profile from "./components/profile.component";
import Favourites from "./components/favourites.component";
import Availability from "./components/availability.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { accessibilityColors } from "./styles/accessibilityColors";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    // Загружаем сохраненные настройки
    const savedSettings = localStorage.getItem("accessibility_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      // Применяем размер шрифта
      document.documentElement.style.fontSize = `${settings.fontSize}px`;

      // Применяем цветовую схему
      const colors = accessibilityColors[settings.colorBlindType];
      Object.entries(colors).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    }

    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    this.props.dispatch(logout());
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <AccessibilityProvider>
        <Router history={history}>
          <style>
            {`
              body, #root {
                background-color: var(--background-primary) !important;
              }
              .navbar.navbar-expand.navbar-dark.bg-dark {
                background-color: var(--navbar) !important;
              }
              .vac_item {
                background-color: var(--background-secondary) !important;
                border-color: var(--border) !important;
              }
              .vac_item p {
                color: var(--text-primary) !important;
              }
              .navbar-dark .navbar-nav .nav-link {
                color: var(--navbar-text) !important;
              }
              .navbar-brand {
                color: var(--navbar-text) !important;
              }
            `}
          </style>
          <div className="app-wrapper" style={{ minHeight: "100vh" }}>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <Link to={"/"} className="navbar-brand">
                AmerkhanovRR
              </Link>
              <div className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to={"/home"} className="nav-link">
                    Job!
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/help"} className="nav-link">
                    help
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/favourites"} className="nav-link">
                    favourites
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/availability"} className="nav-link">
                    ДОСТУПНОСТЬ
                  </Link>
                </li>

                {/* {showModeratorBoard && (
                  <li className="nav-item">
                    <Link to={"/mod"} className="nav-link">
                      Moderator Board
                    </Link>
                  </li>
                )}

                {showAdminBoard && (
                  <li className="nav-item">
                    <Link to={"/admin"} className="nav-link">
                      Admin Board
                    </Link>
                  </li>
                )} 

                {currentUser && (
                  <li className="nav-item">
                    <Link to={"/user"} className="nav-link">
                      User
                    </Link>
                  </li>
                )} */}
              </div>

              {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={this.logOut}>
                      LogOut
                    </a>
                  </li>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </div>
              )}
            </nav>

            <div className="container mt-3">
              <Switch>
                <Route exact path={["/", "/home"]} component={Home} />
                <Route exact path="/help" component={Help} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/favourites" component={Favourites} />
                <Route exact path="/availability" component={Availability} />
                {/* <Route path="/user" component={BoardUser} />
                <Route path="/mod" component={BoardModerator} />
                <Route path="/admin" component={BoardAdmin} /> */}
              </Switch>
            </div>

            <AuthVerify logOut={this.logOut} />
          </div>
        </Router>
      </AccessibilityProvider>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);
