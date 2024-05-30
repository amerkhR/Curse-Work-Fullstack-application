import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/vacancies')
      .then(response => {
        setVacancies(response.data);
      })
      .catch(error => {
        console.error('Error fetching vacancies: ', error);
      });
  }, []);

  return (
    <div>
      <h4> Список вакансий </h4>
      <ul>
        {vacancies.map(vacancy => (
          <li key={vacancy.id}>
            <p>{vacancy.name}</p>
            <p>{vacancy.salary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vacancies;