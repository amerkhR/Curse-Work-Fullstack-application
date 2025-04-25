import React, { Component, useEffect, useState, useMemo } from "react";
import classes from "./home.module.css"
import axios from "axios";
import { connect } from "react-redux";
import Vacancies from "./vacansies.component";


import AddVac from "./add-vacancy.component";
import FilterVac from "./filter-vacancy.component";
import Search from "./search.component";
import VacResponse from "./vac_response.component";


const Home = (props) => {

  const [searchValue, setsearchValue] = useState("")
  const { user: currentUser } = props;
  const [modalActive, setModalActive] = useState(false)
  const [filterActive, setFilterActive] = useState(false)
  const [VacResActive, setVacResActive] = useState(false)
  const [filters, setFilters] = useState({
    salary: 0,
    experience: "все",
    workFormat: "все",
    schedule: "все",
    accessibility: "все",
  });
  
  
  let isAdmin = false
  if(currentUser && currentUser.roles.includes("ROLE_ADMIN")) {
    isAdmin = true
  }

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = useMemo(() => {
    return filters.salary > 0 ||
      filters.experience !== "все" ||
      filters.workFormat !== "все" ||
      filters.schedule !== "все" ||
      filters.accessibility !== "все";
  }, [filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      salary: 0,
      experience: "все",
      workFormat: "все",
      schedule: "все",
      accessibility: "все",
    });
  };

  
  
  return (
    <div>

      <AddVac active={modalActive} setActive={setModalActive} />
      <FilterVac 
        active={filterActive} 
        setActive={setFilterActive}
        onApplyFilters={handleApplyFilters}
      />
      <div className={classes.searchgroup_contain}>
        <Search 
          searchValue={searchValue} 
          setsearchValue={setsearchValue} 
          isAdmin={isAdmin} 
          setModalActive={setModalActive}
          setFilterActive={setFilterActive}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />
        
      </div>
      <Vacancies 
        searchValue={searchValue}
        filters={filters}
        setVacResActive={setVacResActive} 
      />
      <VacResponse active={VacResActive} setActive={setVacResActive} isAdmin={isAdmin}/>


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
