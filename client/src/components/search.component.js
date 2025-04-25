import React from "react";
import classes from "./home.module.css"
import { FaSearch, FaFilter, FaPlus, FaTimes } from "react-icons/fa";

const Search = ({ 
  searchValue, 
  setsearchValue, 
  isAdmin, 
  setModalActive, 
  setFilterActive,
  hasActiveFilters,
  onResetFilters 
}) => {
  return (
    <div className={classes.search_container}>
      <div className={classes.search_input_group}>
        <input
          type="text"
          placeholder="Поиск вакансий"
          className={classes.input_field}
          value={searchValue}
          onChange={(event) => setsearchValue(event.target.value)}
        />
        <button 
          className={classes.search_btn}
          title="Поиск"
        >
          <FaSearch size={20} />
        </button>
      </div>
      <div className={classes.filter_group}>
        <button 
          className={classes.filter_btn} 
          onClick={() => setFilterActive(true)}
          title="Открыть фильтры"
        >
          <FaFilter size={20} />
        </button>
        {hasActiveFilters && (
          <button 
            className={classes.reset_filter_btn} 
            onClick={onResetFilters}
            title="Сбросить все фильтры"
          >
            <FaTimes size={20} />
          </button>
        )}
        {isAdmin && (
          <button 
            className={classes.add_btn} 
            onClick={() => setModalActive(true)}
            title="Добавить новую вакансию"
          >
            <FaPlus size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Search