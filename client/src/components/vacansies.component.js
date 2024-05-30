import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classes from "./home.module.css"

import { FaRegHeart } from "react-icons/fa6";

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/test/vacancies')
      .then(response => {
        console.log(response.data.vacs)
        setVacancies(response.data.vacs);
      })
      .catch(error => {
        console.error('Error fetching vacancies: ', error);
      });
  }, []);

  return (
    <div>
      <ul className={classes.vac_container}>
        {vacancies.map(vacancy => (
          <li className={classes.vac_item} key={vacancy.id}>
            <FaRegHeart  className={classes.heart} size={30}/>
            <p>{vacancy.name}</p>
            <p>{vacancy.company}</p>
            <p>{vacancy.salary}</p>
            <button type='submit' className={classes.vac_item_button}>Откликнуться</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vacancies;