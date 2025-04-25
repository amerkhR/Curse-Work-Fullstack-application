import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./home.module.css";
import { FaHeart } from "react-icons/fa6";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Favourites = ({ user }) => {
  const [vacancies, setVacancies] = useState([]);
  const [activeElements, setActiveElements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    axios
      .get("http://localhost:8080/api/test/vacancies")
      .then((response) => {
        setVacancies(response.data.vacs);
      })
      .catch((error) => {
        console.error("Error fetching vacancies: ", error);
      });
  }, [user]);

  if (!user) {
    return <Redirect to="/login" />;
  }

  const favoriteVacancies = vacancies.filter(
    (vacancy) => vacancy.isFavorite === true
  );

  const favoriteVac = (id) => {
    if (activeElements.includes(id)) {
      setActiveElements(activeElements.filter((el) => el !== id));
    } else {
      setActiveElements([...activeElements, id]);
    }

    setVacancies((prevVacancies) =>
      prevVacancies.map((vacancy) =>
        vacancy.id === id ? { ...vacancy, isFavorite: false } : vacancy
      )
    );

    axios
      .put("http://localhost:8080/api/test/favorites/" + id)
      .then((response) => {
        console.log("Vacancy update successfully");
      })
      .catch((error) => {
        console.error("Error update vacancy: ", error);
        setVacancies((prevVacancies) =>
          prevVacancies.map((vacancy) =>
            vacancy.id === id ? { ...vacancy, isFavorite: true } : vacancy
          )
        );
      });
  };

  return (
    <div>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ff3366",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
      {favoriteVacancies.length > 0 ? (
        <ul className={classes.vac_container}>
          {favoriteVacancies.map((vacancy) => (
            <li className={classes.vac_item} key={vacancy.id}>
              <FaHeart
                className={`${classes.heart} ${classes.active}`}
                size={30}
                onClick={() => favoriteVac(vacancy.id)}
              />
              <p>{vacancy.name}</p>
              <p>{vacancy.company}</p>
              <p>{vacancy.salary}</p>
              <button className={classes.vac_item_button}>Откликнуться</button>
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}
        >
          В списке избранного пока пусто :(
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Favourites);
