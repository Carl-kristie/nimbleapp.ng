import React from 'react'

export default function Home() {
  return (
    <div>
        <section className="home">
            
            <div className="home-left">

                <div className="header">
                    <div className="logo"></div>
                    <div className="new-chat"></div>
                    <div className="setting"></div>
                </div>

                <div className="search-messages">
                    <input type="text" name="search" id="search" className="search" />
                </div>

                <div className="messages">
                    <div className="message">
                        <div className="avatar"></div>
                        <div className="chat-name"></div>
                        <div className="time-elapsed"></div>
                    </div>
                </div>

            </div>
            <div className="home-right">

            </div>
        </section>
    </div>
  )
}
