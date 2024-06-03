import React, { Component, useEffect, useState } from "react";
import classes from "./home.module.css"
import axios from "axios";
import { connect } from "react-redux";
import Vacancies from "./vacansies.component";

import { BsSearch } from "react-icons/bs";
import { LuSettings2 } from "react-icons/lu";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddVac from "./add-vacancy.component";


const Home = (props) => {


  const { user: currentUser } = props;
  const [modalActive, setModalActive] = useState(false)

  return (
    <div>

      <AddVac active={modalActive} setActive={setModalActive} />
      <div className={classes.searchgroup_contain}>
        <input className={classes.input_field} type="text" placeholder="Профессия, должность или компания" />
        <button className={classes.search_btn} type="submit"> <BsSearch size={30} /></button>
        <button className={classes.filter_btn}><LuSettings2 size={30} /></button>
        {currentUser && currentUser.roles.includes("ROLE_ADMIN") && (
        <button className={classes.add_btn} onClick={() => setModalActive(true)}>
          <IoMdAddCircleOutline size={33} />
        </button>)}
      </div>
      <Vacancies />


    </div>
  );
}



function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Home);
