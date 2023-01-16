import HomeLeft from './HomeLeft'
import HomeRight from './HomeRight'
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import React from 'react'
import { useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function Home() {
  const {currentUser} = useContext(AuthContext)
  return (
    
    <div>
        <section className="home">
            
            <HomeLeft></HomeLeft>
            <HomeRight></HomeRight>
        </section>
    </div>
  )
}
