import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./home.module.css";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const Vacancies = ({ searchValue, setVacResActive, user }) => {
  const [vacancies, setVacancies] = useState([]);
  const [activeElements, setActiveElements] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/test/vacancies")
      .then((response) => {
        setVacancies(response.data.vacs);
      })
      .catch((error) => {
        console.error("Error fetching vacancies: ", error);
      });
  }, []);

  const favoriteVac = (id, e) => {
    e.stopPropagation();

    if (!user) {
      setError(
        "Чтобы добавлять вакансии в избранное, необходимо авторизоваться"
      );
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (activeElements.includes(id)) {
      setActiveElements(activeElements.filter((el) => el !== id));
    } else {
      setActiveElements([...activeElements, id]);
    }

    axios
      .put("http://localhost:8080/api/test/favorites/" + id)
      .then((response) => {
        console.log("Vacancy update successfully");
      })
      .catch((error) => {
        console.error("Error update vacancy: ", error);
      });
  };

  const handleVacancyClick = (id) => {
    history.push(`/vacancy/${id}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setError("Чтобы откликнуться на вакансию, необходимо авторизоваться");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setVacResActive(true);
  };

  const filteredVacancies = vacancies.filter((vac) => {
    if (vac.name.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    } else if (vac.company.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  });

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
      <ul className={classes.vac_container}>
        {filteredVacancies.map((vacancy) => (
          <li
            className={classes.vac_item}
            key={vacancy.id}
            onClick={() => handleVacancyClick(vacancy.id)}
            style={{ cursor: "pointer" }}
          >
            <div>
              {activeElements.includes(vacancy.id) ? (
                <FaHeart
                  className={`${classes.heart} ${classes.active}`}
                  size={30}
                  onClick={(e) => favoriteVac(vacancy.id, e)}
                />
              ) : (
                <FaRegHeart
                  className={classes.heart}
                  size={30}
                  onClick={(e) => favoriteVac(vacancy.id, e)}
                />
              )}
            </div>
            <div className={classes.vac_item_info}>
              <h3>{vacancy.name}</h3>
              <p className={classes.company}>{vacancy.company}</p>
              <p className={classes.salary}>{vacancy.salary}</p>
              <p className={classes.details}>
                <span>{vacancy.experience}</span> •
                <span>{vacancy.workFormat}</span> •
                <span>{vacancy.schedule}</span>
              </p>
            </div>
            <button
              className={classes.vac_item_button}
              onClick={handleApplyClick}
            >
              Откликнуться
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Vacancies);
