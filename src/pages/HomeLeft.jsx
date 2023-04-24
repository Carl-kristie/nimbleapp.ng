import React from 'react'
import { useState, useCallback } from 'react'
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import logobg from "../images/logobg.jpg"
import { useEffect } from 'react';
import { ChatContext } from '../context/chatContext';
import TimeAgo from 'javascript-time-ago'

import { auth, storage } from '../firebase'
import { signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, EmailAuthCredential } from 'firebase/auth';
// English.
import en from 'javascript-time-ago/locale/en'

import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
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



const HomeLeft = () => {
    const[username, setUsername] = useState("")
    const [user, setUser] = useState(null)
    const [admins, setAdmins] = useState([])
    const [currentAdmin, setCurrAdmin] = useState({})
    const [err, setErr] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const {dispatch} = useContext(ChatContext)
    const {data} = useContext(ChatContext)
    const [chats, setChats] = useState([])
    const [notice, setNotice] = useState(true)
    const activeAdmins = []
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')

    const handleSearch = async () => {
            
      const q = query(
        collection(db, "users"),
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
        collection(db, "admins")
      );
      
  
      try {
          
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(element => {
          var data = element.data();
          setAdmins(arr => [...arr , data]);
      });
      } catch (err) {
        setErr(true);
      }
    }



const handleKey = (e) => {
  e.code === "Enter" && handleSearch();
}

const [userInfo, setUserInfo] = useState(null)
// const fetchUserData = async (e) => {

//   function checkifavailiable() {
//     const docRef = doc(db, "users", currentUser.uid);
//   try {
//       const docSnap = getDoc(docRef);
//       console.log(docSnap)
//       console.log(docSnap.data)
//       if(docSnap.exists()) {
//         
//       } else {
//           console.log("Document does not exist")
//       }
      
      
  
//   } catch(error) {
//       console.log(error)
//       console.log("there was an error")
//       console.log(currentUser.uid)
//   }
//   }
//   currentUser.uid && checkifavailiable()

// }

function fetchUserData() {
  function checkifavailiable() {
    getDoc(doc(db, "users", currentUser.uid)).then(docSnap => {
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    })
  }
  currentUser.uid && checkifavailiable()
}


const [loading, setLoading] = useState()
const [file, setFile] = useState()
const [percent, setPercent] = useState()
const [fileURL, setFileURL] = useState()


async function changePic(e) {

  setLoading(true);
  setFile(e.target.files[0]);
  
}



const fetchCurrentAdmin = async (e) => {

  const admin = collection(db, "admins")
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
            lastMessage: "",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", currentAdmin.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.firstName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
       
      }
      document.getElementById("users").classList.remove("translatefull")

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


function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

function openAdmins() {
  document.getElementById("users").classList.toggle("translatefull")
}

const openChat = (u) => {
  dispatch({ type: "CHANGE_USER", payload: u });
  document.getElementById("headerRight").style.display = "grid"
  console.log(window.screen.availWidth)
  if (window.screen.availWidth < "900") {

  document.getElementById("homeleft").style.display = "none"
  document.getElementById("homeright").style.display = "grid"
  } 
  else{
    document.getElementById("homeright").style.display = "grid"
  }
};

function openSettings() {
  document.getElementById("settingContainer").style.display = "grid"
  document.getElementById("mainSetting").style.display = "grid"

}

function openProfileSetting() {
  document.getElementById("mainSetting").style.display = "none"
  document.getElementById("profileSetting").style.display = "grid"
  
}

function settingBack() {
  document.getElementById("settingContainer").style.display = "grid"
  document.getElementById("mainSetting").style.display = "grid"
  document.getElementById("profileSetting").style.display = "none"
  document.getElementById("alertSetting").style.display = "none"
  document.getElementById("passwordSetting").style.display = "none"


}

function openPassword() {
  document.getElementById("mainSetting").style.display = "none"
  document.getElementById("passwordSetting").style.display = "grid"
  
}

function openAlert() {
  document.getElementById("mainSetting").style.display = "none"
  document.getElementById("alertSetting").style.display = "grid"
}


function pic(e) {
  if (file) {
    console.log(file)
    const storage = getStorage();
    const storageRef = ref(storage, userInfo.firstName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
  
        setPercent(percent);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          updateProfile(auth.currentUser, {
            photoURL: url
          })
            .then(() => {
              console.log("profile updated");
              console.log(currentUser.photoURL);
              setFileURL(url); // Update the fileURL state with the URL
              setLoading(false);
              updateDoc(doc(db, "users", currentUser.uid), {
                photoURL: url
              })
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        });
      }
    );
  }
}

const handleProfileSubmit = async (e) => {
  e.preventDefault()
  console.log(userInfo)
  let firstName = e.target[1].value
  let lastName = e.target[2].value
  let phone = e.target[4].value
  await updateDoc(doc(db, "users", currentUser.uid),{
    firstName,
    lastName,
    phone,
})
window.location.reload(true)
}

const handlePasswordChange = async (e) => {
  e.preventDefault()
  let password = e.target[0].value
  let password2 = e.target[1].value

  const newPassword = password2;

  const credential = EmailAuthProvider.credential(
    currentUser.email, 
    password
);

reauthenticateWithCredential(currentUser, credential).then(() => {
  
  // User re-authenticated.
  updatePassword(currentUser, newPassword).then(() => {
    alert("password updated succcessfully")
  }).catch((error) => {
    console.log(error)
    
  });
}).catch((error) => {
  // An error ocurred
  console.log(error)
  // ...
  alert("you have entered an incorrect password")
});

 
}

function closeProfile() {
  document.getElementById("mainSetting").style.display = "none"
  document.getElementById("profileSetting").style.display = "none"
  document.getElementById("alertSetting").style.display = "none"
  document.getElementById("passwordSetting").style.display = "none"
  document.querySelector("#settingContainer").style.display = "none"
}

useEffect(() => {
  pic()

}, [file])


useEffect(() => {
fetchUserData()
}, [currentUser])

useEffect(() => {
  fetchAdmins()
}, [])

var d = new Date(0)

    return ( 

<div className="home-left" id='homeleft'>

<div className="header">
    <div className="logo"><img src={logobg} alt="" /></div>
    <div className="new-chat" onClick={openAdmins}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16699 3.33337H3.33366C2.89163 3.33337 2.46771 3.50897 2.15515 3.82153C1.84259 4.13409 1.66699 4.55801 1.66699 5.00004V16.6667C1.66699 17.1087 1.84259 17.5327 2.15515 17.8452C2.46771 18.1578 2.89163 18.3334 3.33366 18.3334H15.0003C15.4424 18.3334 15.8663 18.1578 16.1788 17.8452C16.4914 17.5327 16.667 17.1087 16.667 16.6667V10.8334" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.417 2.08332C15.7485 1.7518 16.1981 1.56555 16.667 1.56555C17.1358 1.56555 17.5855 1.7518 17.917 2.08332C18.2485 2.41484 18.4348 2.86448 18.4348 3.33332C18.4348 3.80216 18.2485 4.2518 17.917 4.58332L10.0003 12.5L6.66699 13.3333L7.50033 9.99998L15.417 2.08332Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
    <div className="setting" onClick={userInfo && openSettings}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#b6b4b4" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="48" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><path d="M197.4,80.7a73.6,73.6,0,0,1,6.3,10.9L229.6,106a102,102,0,0,1,.1,44l-26,14.4a73.6,73.6,0,0,1-6.3,10.9l.5,29.7a104,104,0,0,1-38.1,22.1l-25.5-15.3a88.3,88.3,0,0,1-12.6,0L96.3,227a102.6,102.6,0,0,1-38.2-22l.5-29.6a80.1,80.1,0,0,1-6.3-11L26.4,150a102,102,0,0,1-.1-44l26-14.4a73.6,73.6,0,0,1,6.3-10.9L58.1,51A104,104,0,0,1,96.2,28.9l25.5,15.3a88.3,88.3,0,0,1,12.6,0L159.7,29a102.6,102.6,0,0,1,38.2,22Z" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div>
</div>

<div className="search-messages">
    <div className="search-icon"><svg data-v-27514174="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-27514174="" d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path data-v-27514174="" d="M17.5 17.5L13.875 13.875" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><input type="text" onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} name="search" id="search" className="search" placeholder='Search Messages...' />
</div>


    <div className="messages messagesone">
    {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
          <div className="message-item" key={chat[0]} onClick={() => openChat(chat[1].userInfo)}>
            <div className="first-col"><img src={admins[admins.findIndex(admin => admin.uid == chat[1].userInfo.uid)].photoURL} alt="" /></div>
            <div className="second-col">
            <div className="first-row">{chat[1].userInfo.displayName}</div>
                <div className="second-row">{chat[1].userInfo.lastMessage}</div>
            </div>
            <div className="third-col"></div>
        </div>
        ))}
    </div>


    
<div className="messages users translatezero" id='users'>
      {admins?
      admins.slice(0,3).map((element) => {
        return <div className="message-item user-item" onClick={handleSelect} key={element.uid}>
      <img src={element.photoURL} alt="" className="profile-photo user-photo" />
      <div className="display-name">{element.displayName}</div>
      </div>

      })
    :<span>Loading....</span>}
    </div>



    
    <div className="profile-container setting-container" id='settingContainer'>
            {userInfo? <div className="settings " id='mainSetting'>
                <div className="h3">Settings</div>
                <div className="xx" onClick={closeProfile}>x</div>
                <div className="title">PROFILE</div>
                <div className="profile-settings setting-item" onClick={openProfileSetting}>
                    <img className='profile-photo photo-setting' src={fileURL? fileURL: currentUser.photoURL} alt="" />
                    <div className="profile-others">
                        <div className="profile-name">{userInfo.firstName + " " + userInfo.lastName}</div>
                        <div className="profile-email">{userInfo.email}</div>
                    </div>
                    <div className="caret"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="#b0abab" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg></div>
                </div>
                <div className="title">SECURITY</div>
                <div className="other-setting-item" onClick={openPassword}><div className="other-item">Password Settings</div><div className="caret"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="#b0abab" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg></div></div>
                <div className="title">NOTIFICATION</div>
                <div className="other-setting-item" onClick={openAlert}>
                  <div className="other-item">Alert & Notification Settings</div><div className="caret"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="#b0abab" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg></div>
                </div>
                <div className="logout-btn"><div className="logout" onClick={()=>signOut(auth)}>Log Out</div></div>
            </div>: <span>Loading...</span>}







            <div className=" settings profile-setting-container" id='profileSetting'>
            <div className="xx" onClick={closeProfile}>x</div>
          <form onSubmit={handleProfileSubmit} className="profile-setting-form">
            <svg onClick={settingBack} xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
            <h3>Profile Settings</h3>
            <div className="profile-photo-setting">

                <div className="profile-photo-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#fff" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,208H48a16,16,0,0,1-16-16V80A16,16,0,0,1,48,64H80L96,40h64l16,24h32a16,16,0,0,1,16,16V192A16,16,0,0,1,208,208Z" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><circle cx="128" cy="132" r="36" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle></svg>
                <img src={currentUser.photoURL} className="profile-photo" alt="Profile Photo" /> <input type="file" name="file" id="file" onChange={changePic}/></div>
                <span>Tap to change profile photo</span>
                {loading && <p>Uploading...</p>}
            </div>
            <label htmlFor="firstname">First Name</label>
            <input type="text" name="firstname" defaultValue={userInfo && userInfo.firstName} required id="firstname" /> 
            <label htmlFor="lastname">Last Name</label>
            <input type="text" name="lastname" defaultValue={userInfo && userInfo.lastName} required id="lastname" />
            <label for="phonenumber">Phone</label>
            <div className="phone">
            <select name="prefix" id="prefix">
                <option value="ng">NG +234</option>
            </select>
            <input type="number" name="" defaultValue={userInfo && userInfo.phone} required minLength={11} id=""/>
            </div>
            <button className="button" style={{color:"white"}}>Save Changes</button>
          </form>
        </div>








        <div className=" settings profile-setting-container password-container" id='passwordSetting'>
        <div className="xx" onClick={closeProfile}>x</div>
          <form onSubmit={handlePasswordChange} className="profile-setting-form password-setting-form">
          <svg onClick={settingBack} xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
          <h3>Password Settings</h3>
          <label htmlFor="current password">Current Password</label>
          <input type="password" name="currentpassword" required minLength={8} id="currentpassword" />
          <label htmlFor="newpassword">New Password</label>
          <input type="password" name="newpassword" required minLength={8} id="newpassword" />
          <button className="button" style={{color:"white"}}>Save Changes</button>
          </form>
        </div>







        <div className=" settings profile-setting-container alert-container" id='alertSetting'>
        <div className="xx" onClick={closeProfile}>x</div>
          <form action="submit" className="profile-setting-form alert-setting-form">
          <svg onClick={settingBack} xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#b0abab" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
          <h3 className='notification-header'>Notification Settings</h3>
          <div className="notification">
            <h4>All Message Alerts</h4>
            <label class="switch">
            <input id='noticebox' type="checkbox"/>
            <span class="slider round"></span>
            </label>
          </div>
          </form>
        </div>
          

        </div>







</div>

     );
}
 
export default HomeLeft;