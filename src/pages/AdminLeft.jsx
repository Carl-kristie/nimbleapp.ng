import React from 'react'
import { useState, useCallback } from 'react'
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import logobg from "../images/logobg.jpg"
import { useEffect } from 'react';
import { ChatContext } from '../context/chatContext';
import { useContext } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  onSnapshot,
} from "firebase/firestore";



const AdminLeft = () => {
    const[username, setUsername] = useState("")
    const [user, setUser] = useState(null)
    const [admins, setAdmins] = useState([])
    const [currentAdmin, setCurrAdmin] = useState({})
    const [err, setErr] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const {dispatch} = useContext(ChatContext)
    const {data} = useContext(ChatContext)
    const [chats, setChats] = useState([])
    const activeAdmins = []


    const handleSearch = async () => {
            
      const q = query(
        collection(db, "admins"),
        where("displayName", "==", username)
      );
      
  
      try {
          
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    };

    const fetchAdmins = async () => {
      const q = query(
        collection(db, "users")
      );
      
  
      try {
          
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(element => {
          var data = element.data();
          setAdmins(arr => [...arr , data]);
          
      });
      setAdmins([...new Set(admins)])
      console.log(admins, admins.length)
      } catch (err) {
        setErr(true);
      }
    }




const handleKey = (e) => {
  e.code === "Enter" && handleSearch();
}

const [userInfo, setUserInfo] = useState(null)
function fetchUserData() {
  function checkifavailiable() {
    getDoc(doc(db, "admins", currentUser.uid)).then(docSnap => {
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    })
  }
  currentUser.uid && checkifavailiable()
}




const fetchCurrentAdmin = async (e) => {

  const admin = collection(db, "users")
  const q = query(
    admin,
    where("displayName", "==", e.target.innerHTML)
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setCurrAdmin(doc.data())
    });
  } catch (err) {
    setErr(true);
    console.log(err)
  }
};

const selectFunction = async () => {
  const combinedId =
      currentUser.uid > currentAdmin.uid
        ? currentUser.uid + currentAdmin.uid
        : currentAdmin.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentAdmin.uid,
            displayName: currentAdmin.displayName,
            photoURL: currentAdmin.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", currentAdmin.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
       
      }
    } catch (err) {
      console.log(err)
    }
  };

const handleSelect = async (e) => {
    fetchCurrentAdmin(e)
    currentUser.uid && selectFunction()

}


useEffect(() => {
  const getChats = () => {
    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data());
    });

    return () => {
      unsub();
    };
  };

  currentUser.uid && getChats();
}, [currentUser.uid]);


function openAdmins() {
  document.getElementById("users").classList.toggle("translatefull")
}

const openChat = (u) => {
  dispatch({ type: "CHANGE_USER", payload: u });
  document.getElementById("avatar").style.opacity = 1
  document.getElementById("homeleft").style.display = "none"
  document.getElementById("homeright").style.display = "grid"
};

useEffect(() => {
fetchUserData()
}, [currentUser])

useEffect(() => {
  fetchAdmins()

}, [])

    return ( 

<div className="home-left" id='homeleft'>

<div className="header">
    <div className="logo"><img src={logobg} alt="" /></div>
    <div className="new-chat" onClick={openAdmins}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16699 3.33337H3.33366C2.89163 3.33337 2.46771 3.50897 2.15515 3.82153C1.84259 4.13409 1.66699 4.55801 1.66699 5.00004V16.6667C1.66699 17.1087 1.84259 17.5327 2.15515 17.8452C2.46771 18.1578 2.89163 18.3334 3.33366 18.3334H15.0003C15.4424 18.3334 15.8663 18.1578 16.1788 17.8452C16.4914 17.5327 16.667 17.1087 16.667 16.6667V10.8334" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.417 2.08332C15.7485 1.7518 16.1981 1.56555 16.667 1.56555C17.1358 1.56555 17.5855 1.7518 17.917 2.08332C18.2485 2.41484 18.4348 2.86448 18.4348 3.33332C18.4348 3.80216 18.2485 4.2518 17.917 4.58332L10.0003 12.5L6.66699 13.3333L7.50033 9.99998L15.417 2.08332Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
    <div className="setting"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#b6b4b4" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="48" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><path d="M197.4,80.7a73.6,73.6,0,0,1,6.3,10.9L229.6,106a102,102,0,0,1,.1,44l-26,14.4a73.6,73.6,0,0,1-6.3,10.9l.5,29.7a104,104,0,0,1-38.1,22.1l-25.5-15.3a88.3,88.3,0,0,1-12.6,0L96.3,227a102.6,102.6,0,0,1-38.2-22l.5-29.6a80.1,80.1,0,0,1-6.3-11L26.4,150a102,102,0,0,1-.1-44l26-14.4a73.6,73.6,0,0,1,6.3-10.9L58.1,51A104,104,0,0,1,96.2,28.9l25.5,15.3a88.3,88.3,0,0,1,12.6,0L159.7,29a102.6,102.6,0,0,1,38.2,22Z" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div>
</div>

<div className="search-messages">
    <div className="search-icon"><svg data-v-27514174="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-27514174="" d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path data-v-27514174="" d="M17.5 17.5L13.875 13.875" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><input type="text" onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} name="search" id="search" className="search" placeholder='Search Messages...' />
</div>


    <div className="messages messagesone">
    {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
          <div className="message-item" key={chat[0]} onClick={() => openChat(chat[1].userInfo)}>
            <div className="first-col"><img src={chat[1].userInfo.photoURL} alt="" /></div>
            <div className="second-col">
            <div className="first-row">{chat[1].userInfo.displayName}</div>
                <div className="second-row">{chat[1].lastmessage}</div>
            </div>
            <div className="third-col">5mins ago</div>
        </div>
        ))}
    </div>


    
<div className="messages users translatezero" id='users'>
      {admins? 
      admins.map((element) => {
        return <div className="message-item user-item" onClick={handleSelect} key={element.uid}>
      <img src={element.photoURL} alt="" className="profile-photo user-photo" />
      <div className="display-name">{element.displayName}</div>
      </div>

      })
    :<span>Loading....</span>}
    </div>


        {/* <div className="profile-container setting-container">
            {userInfo? <div className="settings">
                <div className="h3">Settings</div>
                <div className="title">PROFILE</div>
                <div className="profile-settings setting-item">
                    <img className='profile-photo photo-setting' src={userInfo.photoURL} alt="" />
                    <div className="profile-others">
                        <div className="profile-name">{userInfo.displayName}</div>
                        <div className="profile-email">{userInfo.email}</div>
                    </div>
                </div>
                <div className="title">SECURITY</div>
                <div className="setting-item">Password Settings</div>
                <div className="title">NOTIFICATION</div>
                <div className="setting-item">
                  Alert & Notification Settings
                </div>
                <div className="logout-btn">Log Out</div>
            </div>: <span>Loading...</span>}
        </div> */}
</div>

     );
}
 
export default AdminLeft;