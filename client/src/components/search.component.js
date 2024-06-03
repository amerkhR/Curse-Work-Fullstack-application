import React from "react";
import classes from "./home.module.css"

import { BsSearch } from "react-icons/bs";
import { LuSettings2 } from "react-icons/lu";
import { MdClear } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";

const Search = ({searchValue, setsearchValue, isAdmin, setModalActive}) => {
  

  return (
    <div>
      <input value={searchValue} onChange={event => setsearchValue(event.target.value)} className={classes.input_field} type="text" placeholder="Профессия, должность или компания" />
      <button className={classes.search_btn} type="submit"> <BsSearch size={30} /></button>
      <button className={classes.filter_btn}><LuSettings2 size={30} /></button>
      {isAdmin  && <button className={classes.add_btn} onClick={() => setModalActive(true)}>
          <IoMdAddCircleOutline size={33} />
        </button> }
      {searchValue && (
        <MdClear onClick={() => setsearchValue("")} className={classes.delete_btn} size={30}/>
      )}
    </div>
  )
}

export default Search