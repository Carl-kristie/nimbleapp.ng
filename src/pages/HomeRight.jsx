import React from 'react'
import { useState, createContext, useContext } from "react";
import defaultImage from "../images/user.png"
import { createPicker} from 'picmo'
import { createPopup } from '@picmo/popup-picker';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import { db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { async } from '@firebase/util';


const HomeRight = () => {
    const user = useContext(AuthContext)
    const {currentUser} = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(null)
const fetchUserData = async() =>{
    const docRef = doc(db, "users", "TqsRq1vUWQW4nAdWB1AHQHUtiGG2");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
}
        useEffect(() => {
            fetchUserData()
            console.log(userInfo)
        }, [])
        
  
    // 
    function hideContact() {
        document.getElementById("contactInfo").style.display = "none"
    }
    function openContact() {
        document.getElementById("contactInfo").style.display = "grid";
    }
    function showProfile(){
        document.querySelector(".profile-container").style.display = "block"
        document.querySelector(".profile-details").style.display = "grid"
    }

    function closeProfile() {
        document.querySelector(".profile-container").style.display = "none"
        document.querySelector(".profile-details").style.display = "none"
    }


    return ( 
        <div className="home-right">
        <div className="chat-header">
            <div className="avatar message-avatar"><img src={defaultImage} alt="" /></div>
            <div className="message-chat-name">MANUNITED - GIFTCARDS</div>
            <div className="message-options" onClick={openContact}><div onClick={showProfile} className="contact-info" id='contactInfo'><span on>Contact info</span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#0d0d0d" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="96" r="64" fill="none" stroke="#0d0d0d" stroke-miterlimit="10" stroke-width="16"></circle><path d="M31,216a112,112,0,0,1,194,0" fill="none" stroke="#0d0d0d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div><svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2C4 1.60444 3.8827 1.21776 3.66294 0.888858C3.44318 0.55996 3.13082 0.303614 2.76537 0.152239C2.39992 0.000863686 1.99778 -0.0387431 1.60982 0.0384275C1.22186 0.115598 0.865492 0.30608 0.585787 0.585785C0.306082 0.86549 0.115601 1.22186 0.0384302 1.60982C-0.0387402 1.99778 0.000866492 2.39991 0.152242 2.76537C0.303617 3.13082 0.559962 3.44318 0.88886 3.66294C1.21776 3.8827 1.60444 4 2 4C2.53043 4 3.03914 3.78928 3.41421 3.41421C3.78929 3.03914 4 2.53043 4 2ZM14 2C14 2.39556 14.1173 2.78224 14.3371 3.11114C14.5568 3.44004 14.8692 3.69638 15.2346 3.84776C15.6001 3.99913 16.0022 4.03874 16.3902 3.96157C16.7781 3.8844 17.1345 3.69392 17.4142 3.41421C17.6939 3.13451 17.8844 2.77814 17.9616 2.39018C18.0387 2.00222 17.9991 1.60008 17.8478 1.23463C17.6964 0.869179 17.44 0.556821 17.1111 0.337059C16.7822 0.117296 16.3956 -2.14718e-06 16 -2.12989e-06C15.4696 -2.10671e-06 14.9609 0.210712 14.5858 0.585785C14.2107 0.960857 14 1.46956 14 2ZM7 2C7 2.39556 7.1173 2.78224 7.33706 3.11114C7.55682 3.44004 7.86918 3.69638 8.23463 3.84776C8.60009 3.99913 9.00222 4.03874 9.39018 3.96157C9.77814 3.8844 10.1345 3.69392 10.4142 3.41421C10.6939 3.13451 10.8844 2.77814 10.9616 2.39018C11.0387 2.00222 10.9991 1.60008 10.8478 1.23463C10.6964 0.869179 10.44 0.556822 10.1111 0.337059C9.78224 0.117296 9.39556 -1.8412e-06 9 -1.82391e-06C8.46957 -1.80073e-06 7.96086 0.210712 7.58579 0.585785C7.21071 0.960858 7 1.46957 7 2Z" fill="#51545C"></path></svg></div>
        </div>
        <div className="chats" onClick={hideContact}>
        <div className="message-items">
                <div className="owner">hello</div>
                <div className="other">how are you doing</div>
                <div className="owner">I'm fine thank you</div>
                <div className="other">Okay i just want to let you know I'm back</div>
            </div>
        </div>
        <div className="chat-footer">
            <div className="import-media">+</div>
            <div className="chat-input">
                <div id="picker"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.967 11.8582C11.4099 12.3073 10.7159 12.5522 10.0003 12.5522C9.28475 12.5522 8.59073 12.3073 8.03366 11.8582C7.86348 11.7167 7.64408 11.6487 7.42373 11.669C7.20337 11.6893 7.00011 11.7963 6.85866 11.9665C6.71721 12.1367 6.64916 12.3561 6.66948 12.5764C6.6898 12.7968 6.79681 13.0001 6.967 13.1415C7.81811 13.852 8.89163 14.2412 10.0003 14.2412C11.109 14.2412 12.1825 13.852 13.0337 13.1415C13.2038 13.0001 13.3109 12.7968 13.3312 12.5764C13.3515 12.3561 13.2834 12.1367 13.142 11.9665C13.072 11.8822 12.986 11.8126 12.8891 11.7615C12.7921 11.7105 12.686 11.679 12.5769 11.669C12.3566 11.6487 12.1372 11.7167 11.967 11.8582ZM7.50033 9.1665C7.66515 9.1665 7.82626 9.11763 7.9633 9.02606C8.10035 8.93449 8.20716 8.80435 8.27023 8.65207C8.3333 8.4998 8.3498 8.33225 8.31765 8.1706C8.2855 8.00894 8.20613 7.86046 8.08958 7.74392C7.97304 7.62737 7.82455 7.548 7.6629 7.51585C7.50125 7.4837 7.3337 7.5002 7.18143 7.56327C7.02915 7.62634 6.89901 7.73315 6.80744 7.8702C6.71587 8.00724 6.667 8.16835 6.667 8.33317C6.667 8.55418 6.75479 8.76615 6.91107 8.92243C7.06735 9.07871 7.27931 9.1665 7.50033 9.1665ZM12.5003 7.49984C12.3355 7.49984 12.1744 7.54871 12.0374 7.64028C11.9003 7.73185 11.7935 7.862 11.7304 8.01427C11.6674 8.16654 11.6509 8.3341 11.683 8.49575C11.7152 8.6574 11.7945 8.80588 11.9111 8.92243C12.0276 9.03897 12.1761 9.11834 12.3378 9.15049C12.4994 9.18265 12.667 9.16614 12.8192 9.10307C12.9715 9.04 13.1017 8.93319 13.1932 8.79615C13.2848 8.65911 13.3337 8.49799 13.3337 8.33317C13.3337 8.11216 13.2459 7.9002 13.0896 7.74392C12.9333 7.58764 12.7213 7.49984 12.5003 7.49984ZM10.0003 1.6665C8.35215 1.6665 6.74099 2.15525 5.37058 3.07092C4.00017 3.9866 2.93206 5.28809 2.30133 6.81081C1.6706 8.33353 1.50558 10.0091 1.82712 11.6256C2.14866 13.2421 2.94234 14.727 4.10777 15.8924C5.27321 17.0578 6.75807 17.8515 8.37458 18.173C9.99109 18.4946 11.6666 18.3296 13.1894 17.6988C14.7121 17.0681 16.0136 16 16.9292 14.6296C17.8449 13.2592 18.3337 11.648 18.3337 9.99984C18.3337 8.90549 18.1181 7.82186 17.6993 6.81081C17.2805 5.79976 16.6667 4.8811 15.8929 4.10728C15.1191 3.33346 14.2004 2.71963 13.1894 2.30084C12.1783 1.88205 11.0947 1.6665 10.0003 1.6665ZM10.0003 16.6665C8.68179 16.6665 7.39286 16.2755 6.29653 15.543C5.2002 14.8104 4.34572 13.7692 3.84113 12.5511C3.33655 11.3329 3.20453 9.99244 3.46176 8.69924C3.719 7.40603 4.35393 6.21814 5.28628 5.28579C6.21863 4.35344 7.40652 3.7185 8.69973 3.46127C9.99293 3.20403 11.3334 3.33606 12.5516 3.84064C13.7697 4.34522 14.8109 5.19971 15.5435 6.29604C16.276 7.39236 16.667 8.6813 16.667 9.99984C16.667 11.7679 15.9646 13.4636 14.7144 14.7139C13.4641 15.9641 11.7684 16.6665 10.0003 16.6665Z" fill="#535F89"></path></svg></div>
                <input type="text" name="message" id="message" />
            </div>
            <div className="record-voice"><svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="#008000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="88" y="24" width="80" height="144" rx="40" fill="none" stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><line x1="128" y1="200" x2="128" y2="232" fill="none" stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><path d="M199.6,136a72.1,72.1,0,0,1-143.2,0" fill="none" stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div>
        </div>
        <div className="profile-container" onClick={closeProfile}>
        </div>
        {userInfo ? <div className="profile-details">
            <h3>Customer's Details</h3>
            <div className="profile-photo"><img src={userInfo.photoUrl} alt="" /></div>
            <div className="displayName">{userInfo.displayName}</div>
            <div className="phone-num">{userInfo.phone}</div>
            <div className="email">{userInfo.email}</div>
            <div className="logout-btn" onClick={()=>signOut(auth)}>logout</div>
            <div className="x" onClick={closeProfile}>x</div>

            </div>: <span className='loading'>Loading...</span>}
           
    </div>
     );
}
 
export default HomeRight;