import { AuthContext } from "../context/AuthContext";
import React from 'react'
import { useContext } from 'react';
import AdminLeft from './AdminLeft';
import AdminRight from './AdminRight';

export default function Home() {
  const {currentUser} = useContext(AuthContext)
  return (
    
    <div>
        <section className="home">
            
            <AdminLeft></AdminLeft>
            <AdminRight></AdminRight>
        </section>
    </div>
  )
}
