import React from "react";
import classes from "./home.module.css"

import { BsSearch } from "react-icons/bs";
import { LuSettings2 } from "react-icons/lu";
import { MdClear } from "react-icons/md";


const Search = ({searchValue, setsearchValue}) => {


  return (
    <div>
      <input value={searchValue} onChange={event => setsearchValue(event.target.value)} className={classes.input_field} type="text" placeholder="Профессия, должность или компания" />
      <button className={classes.search_btn} type="submit"> <BsSearch size={30} /></button>
      <button className={classes.filter_btn}><LuSettings2 size={30} /></button>

      {searchValue && (
        <MdClear onClick={() => setsearchValue("")} className={classes.delete_btn} size={30}/>
      )}
    </div>
  )
}

export default Search