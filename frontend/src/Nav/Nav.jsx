import React from 'react';
import {Link} from 'react-router-dom';
const Nav = () => {
  return (
    <>
    
    <div class="nav">
  <input type="checkbox" id="nav-check"/>
  <div class="nav-header">
    <div class="nav-title">
      <img src="https://img.icons8.com/?size=100&id=pGYIhSTVRG3J&format=png&color=000000" alt="" srcset="" />
    </div>
  </div>
  <div class="nav-btn">
    <label for="nav-check">
      <span></span>
      <span></span>
      <span></span>
    </label>
  </div>
  
  <div class="nav-links">
    <Link to='/' >HOME</Link>
    <Link to='upload' >UPLOAD</Link> 
    <Link to='contact' >DRAWING</Link>
    <Link to='about' >ABOUT</Link>
  
  </div>
</div>
    </>
  )
}

export default Nav