import React, { useEffect, useState } from "react";
import axios from 'axios';
import classes from "./home.module.css"

import { FaRegHeart } from "react-icons/fa6";


const Favourites = () => {

  const [vacancies, setVacancies] = useState([]);
  const [activeElements, setActiveElements] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:8080/api/test/vacancies')
      .then(response => {

        setVacancies(response.data.vacs);
      })
      .catch(error => {
        console.error('Error fetching vacancies: ', error);
      });
  }, []);

  const favoriteVacancies = vacancies.filter(vacancy => vacancy.isFavorite === true)
  //   console.log(favoriteVacancies)

  const favoriteVac = (id) => {
    if (activeElements.includes(id)) {
      setActiveElements(activeElements.filter(el => el !== id));
    } else {
      setActiveElements([...activeElements, id]);
    }
    axios.put('http://localhost:8080/api/test/favorites/' + id)
      .then(response => {
        console.log("Vacancy update successfully")
      })
      .catch(error => {
        console.error('Error update vacancy: ', error);
      })
  }
  

  return (
    <div>
      <ul className={classes.vac_container}>
        {favoriteVacancies.map(vacancy => (
          <li className={classes.vac_item} key={vacancy.id}>
            <FaRegHeart className={classes.heart} size={30} onClick={() => {
              favoriteVac(vacancy.id)
            }} />
            <p>{vacancy.name}</p>
            <p>{vacancy.company}</p>
            <p>{vacancy.salary}</p>
            <button className={classes.vac_item_button} >Откликнуться</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favourites