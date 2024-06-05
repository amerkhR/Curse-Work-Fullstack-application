import React, { Component, useEffect, useState } from "react";
import classes from "./home.module.css"
import axios from "axios";
import { connect } from "react-redux";
import Vacancies from "./vacansies.component";


import AddVac from "./add-vacancy.component";
import Search from "./search.component";
import VacResponse from "./vac_response.component";


const Home = (props) => {

  const [searchValue, setsearchValue] = useState("")
  const { user: currentUser } = props;
  const [modalActive, setModalActive] = useState(false)
  const [VacResActive, setVacResActive] = useState(false)
  
  
  let isAdmin = false
  if(currentUser && currentUser.roles.includes("ROLE_ADMIN")) {
    isAdmin = true
  }

  
  
  return (
    <div>

      <AddVac active={modalActive} setActive={setModalActive} />
      <div className={classes.searchgroup_contain}>
        <Search searchValue={searchValue} setsearchValue={setsearchValue} isAdmin={isAdmin} setModalActive={setModalActive}/>
        
      </div>
      <Vacancies searchValue={searchValue}  setVacResActive={setVacResActive} />
      <VacResponse active={VacResActive} setActive={setVacResActive}/>


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
