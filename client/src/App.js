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
import VacancyDetails from "./components/vacancy-details.component";
import VacResponse from "./components/vac_response.component";
import Company from "./components/company.component";
import ResumeEditor from "./components/Resume/ResumeEditor";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { accessibilityColors } from "./styles/accessibilityColors";

// Добавим DEFAULT_COLORS как запасной вариант
const DEFAULT_COLORS = {
  "--background-primary": "#ffffff",
  "--background-secondary": "#f8f9fa",
  "--text-primary": "#000000",
  "--text-secondary": "#6c757d",
  "--button-primary": "#007bff",
  "--button-secondary": "#6c757d",
  "--button-success": "#28a745",
  "--button-danger": "#dc3545",
  "--button-warning": "#ffc107",
  "--link": "#007bff",
  "--border": "#dee2e6",
  "--navbar": "#343a40",
  "--navbar-text": "#ffffff",
  "--card-bg": "#ffffff",
  "--input-bg": "#ffffff",
  "--input-border": "#ced4da",
  "--table-border": "#dee2e6",
  "--table-stripe": "#f2f2f2",
  "--favorite-active": "#ff3366",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      vacResActive: false,
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
      try {
        const colorBlindType = settings?.colorBlindType || "normal";
        const colors = accessibilityColors[colorBlindType] || DEFAULT_COLORS;

        if (colors && typeof colors === "object") {
          Object.entries(colors).forEach(([property, value]) => {
            if (property && value) {
              document.documentElement.style.setProperty(property, value);
            }
          });
        } else {
          console.warn("Invalid color scheme, using default colors");
          Object.entries(DEFAULT_COLORS).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
          });
        }
      } catch (error) {
        console.error("Error applying color scheme:", error);
        // Применяем цвета по умолчанию в случае ошибки
        Object.entries(DEFAULT_COLORS).forEach(([property, value]) => {
          document.documentElement.style.setProperty(property, value);
        });
      }
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
                    Избранное
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/availability"} className="nav-link">
                    ДОСТУПНОСТЬ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/resume"} className="nav-link">
                    Резюме
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
                      Выйти
                    </a>
                  </li>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Войти
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Регистрация
                    </Link>
                  </li>
                </div>
              )}
            </nav>

            <div className="container mt-3">
              <Switch>
                <Route
                  exact
                  path={["/", "/home"]}
                  render={(props) => (
                    <Home
                      {...props}
                      setVacResActive={(state) =>
                        this.setState({ vacResActive: state })
                      }
                    />
                  )}
                />
                <Route exact path="/help" component={Help} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/favourites" component={Favourites} />
                <Route exact path="/availability" component={Availability} />
                <Route exact path="/resume" component={ResumeEditor} />
                <Route exact path="/user" component={BoardUser} />
                <Route exact path="/mod" component={BoardModerator} />
                <Route exact path="/admin" component={BoardAdmin} />
                <Route
                  exact
                  path="/vacancy/:id"
                  render={(props) => (
                    <VacancyDetails
                      {...props}
                      setVacResActive={(state) =>
                        this.setState({ vacResActive: state })
                      }
                    />
                  )}
                />
                <Route exact path="/company/:companyName" component={Company} />
              </Switch>
            </div>

            {this.state.vacResActive && (
              <VacResponse
                active={this.state.vacResActive}
                setActive={(state) => this.setState({ vacResActive: state })}
                isAdmin={this.state.showAdminBoard}
              />
            )}

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
