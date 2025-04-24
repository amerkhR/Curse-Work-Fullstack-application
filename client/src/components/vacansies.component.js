import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./home.module.css";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useHistory } from "react-router-dom";

const Vacancies = ({ searchValue, setsearchValue, setVacResActive }) => {
  const [vacancies, setVacancies] = useState([]);
  const [activeElements, setActiveElements] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/test/vacancies")
      .then((response) => {
        console.log(response.data.vacs);
        setVacancies(response.data.vacs);
      })
      .catch((error) => {
        console.error("Error fetching vacancies: ", error);
      });
  }, []);

  const favoriteVac = (id) => {
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
      <ul className={classes.vac_container}>
        {filteredVacancies.map((vacancy) => (
          <li
            className={classes.vac_item}
            key={vacancy.id}
            onClick={() => handleVacancyClick(vacancy.id)}
            style={{ cursor: "pointer" }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {activeElements.includes(vacancy.id) ? (
                <FaHeart
                  className={`${classes.heart} ${classes.active}`}
                  size={30}
                  onClick={() => favoriteVac(vacancy.id)}
                />
              ) : (
                <FaRegHeart
                  className={classes.heart}
                  size={30}
                  onClick={() => favoriteVac(vacancy.id)}
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
              onClick={(e) => {
                e.stopPropagation();
                setVacResActive(true);
              }}
            >
              Откликнуться
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vacancies;
