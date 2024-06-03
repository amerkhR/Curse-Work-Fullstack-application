import React, { useState } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import "./addVac.css"

const AddVac = ({ active, setActive }) => {

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    salary: ""
  })

  const handleRefresh = () => {
    window.location.reload();
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handleSubmit = (e) => {
    handleRefresh()
    e.preventDefault()
    axios.post("http://localhost:8080/api/test/vacancies", formData)
      .then((res) => {
        console.log("Vacancy created successfully")
        console.log(res)

      })
      .catch(error => console.log(error))
  }

  return (
    <div className={active ? "AddVac_container active" : "AddVac_container"} onClick={() => setActive(false)}>
      <div className="AddVac_content" onClick={e => e.stopPropagation()}>
        <form className="AddVac_form">
          <input className="AddVac_form_field" type="text" name="name" placeholder="Название" value={formData.name} onChange={handleChange} />
          <input className="AddVac_form_field" type="text" name="company" placeholder="Компания" value={formData.company} onChange={handleChange} />
          <input className="AddVac_form_field" type="text" name="salary" placeholder="Зарплата" value={formData.salary} onChange={handleChange} />
          <button className="AddVac_form_buttn" type="submit" onClick={handleSubmit}>Создать вакансию</button>
        </form>
      </div>
    </div>
  )
}

export default AddVac;