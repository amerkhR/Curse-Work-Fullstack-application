import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import "./vacRes.css"

const VacResponse = ({ active, setActive, isAdmin }) => {

  const filePicker = useRef(null)
  const [resume, setResume] = useState("")

  const [formData, setFormData] = useState({
    contact: "",
    vacancy_id: 2,
    message: "",
    resume: null
  })

  const handleRefresh = () => {
    window.location.reload();
  }

  const handleChange = (e) => {
    const resume = e.target.files[0];
    setFormData({
      ...formData,
      resume
    })
  }

  const handleClick = (event) => {
    event.preventDefault();
    filePicker.current.click();
  }

  const checkAdmin = (e) => {
    console.log(isAdmin)
    e.preventDefault();
    return isAdmin === true ? submitVacResponse() : alert("Чтобы оставлять свои отклики к вакансиям, вам нужно авторизоваться на сайте")
  }

  const submitVacResponse = async (e) => {
    //handleRefresh()
    // e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('resume', formData.resume);
    formDataToSend.append('vacancy_id', formData.vacancy_id);

    await axios.post("http://localhost:8080/api/test/vac_response", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((req, res) => {
        console.log("Vacancy response created successfully")

      })
      .catch(error => console.log(error))
  }


  return (
    <div className={active ? "VacRes_container active" : "VacRes_container"} onClick={() => setActive(false)}>
      <div className="VacRes_content" onClick={e => e.stopPropagation()}>
        <form >
          <input type="text" placeholder="Как c вами связаться?" name="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="VacRes_form_field" />
          <textarea alt="Сопроводительное письмо" placeholder="Сопроводительное письмо" name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="VacRes_form_field" />
          <button onClick={handleClick} className="VacRes_form_buttn">Загрузить резюме</button>
          <input type="file"
            onChange={handleChange}
            name="resume"
            accept=".pdf,.docx"
            // value={formData.file}
            className="hidden"
            ref={filePicker}
          />
          <button className="VacRes_form_buttn" onClick={(e) => checkAdmin(e)}>Отправить</button>
        </form>
      </div>
    </div>
  )
}

export default VacResponse