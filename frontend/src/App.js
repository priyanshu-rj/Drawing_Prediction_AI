import React from 'react';
import Nav from './Nav/Nav';
import {Routes} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Home from './Nav/Home';
import About from './Nav/About';
import Contact from './Nav/Contact';
import Upload from './Nav/Upload';
const App = () => {
  return (
    <>
    <Nav/>
    <Routes>
     <Route path='/' Component={Home} />
    </Routes>
    <Routes>
    <Route path='/about' Component={About} />
    </Routes>
    <Routes>
    <Route path='/contact' Component={Contact} />
    </Routes>
    <Routes>
    <Route path='/upload' Component={Upload} />
    </Routes>
    </>
  )
}

export default App