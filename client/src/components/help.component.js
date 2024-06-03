import React, { useState } from "react"
import classes from "./home.module.css"
import axios from "axios";

const Help = () => {

  const [helpData, setHelpData] = useState({
    username: "",
    contact: "",
    description: ""
  })

  const handleChanged = (e) => {
    setHelpData({
      ...helpData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // window.location.reload();
    axios.post("http://localhost:8080/api/test/help", helpData)
      .then((res) => {
        console.log("Заявка отправлена, спасибо за обратную связь <3")
        alert(res.data.message)
        

      })
      .catch(error => console.log(error))
  }

  return (
    <div>
      <h2>Amerkhanov RR помощь</h2>
      <form>
        <input
          className={classes.help_field}
          placeholder="Как вас зовут?"
          type="text"
          name="username"
          value={helpData.username}
          onChange={handleChanged}
        />
        <input
          className={classes.help_field}
          placeholder="Как с вами связаться?"
          type="text"
          name="contact"
          value={helpData.contact}
          onChange={handleChanged}
        />
        <input
          className={classes.help_field}
          placeholder="Какой у вас вопрос?"
          type="text"
          name="description"
          value={helpData.description}
          onChange={handleChanged}
        />
        <button
          className={classes.help_btn}
          type="submit"
          onClick={handleSubmit}
        > Отправить</button>
      </form>
    </div>
  )
}

export default Help