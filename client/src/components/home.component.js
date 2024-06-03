import React, { Component, useEffect, useState } from "react";
import classes from "./home.module.css"
import axios from "axios";
import { connect } from "react-redux";
import Vacancies from "./vacansies.component";

import { IoMdAddCircleOutline } from "react-icons/io";
import AddVac from "./add-vacancy.component";
import Search from "./search.component";


const Home = (props) => {

  const [searchValue, setsearchValue] = useState("")
  const { user: currentUser } = props;
  const [modalActive, setModalActive] = useState(false)

  
  return (
    <div>

      <AddVac active={modalActive} setActive={setModalActive} />
      <div className={classes.searchgroup_contain}>
        <Search searchValue={searchValue} setsearchValue={setsearchValue}/>
        {currentUser && currentUser.roles.includes("ROLE_ADMIN") && (
        <button className={classes.add_btn} onClick={() => setModalActive(true)}>
          <IoMdAddCircleOutline size={33} />
        </button>)}
      </div>
      <Vacancies searchValue={searchValue} setModalActive={setModalActive}/>


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
