import React from 'react'
import { useState, useCallback } from 'react'
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import logobg from "../images/logobg.jpg"
import { signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, EmailAuthCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { ChatContext } from '../context/chatContext';
import { useContext } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from '../firebase'
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
import { async } from '@firebase/util';



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
    const [fileURL, setFileURL] = useState()
    const [loading, setLoading] = useState()
    const [percent, setPercent] = useState()
const [file, setFile] = useState()

    async function changePic(e) {

setLoading(true);
setFile(e.target.files[0]);

}

useEffect(() => {
  pic()

}, [file])
function pic(e) {
  if (file) {
    console.log(file)
    const storageRef = ref(storage, userInfo.displayName);
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
              updateDoc(doc(db, "admins", currentUser.uid), {
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
      } catch (err) {
        setErr(true);
      }
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
    where("firstName", "==", e.target.innerHTML)
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
            displayName: currentAdmin.firstName,
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

const [users, setUsers] = useState([])

function changeDetails() {
  console.log(users)

}

function checkUsers () {
    users && changeDetails()
    console.log(Object.entries(chats))
}

chats && checkUsers()



useEffect(() => {
  const getUsers = async() => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  var data = doc.data();
  setUsers(arr => [...arr , data]);
});
  };

  currentUser.uid && getUsers();
}, [currentUser.uid]);

users? console.log(users): console.log("Loading users")


function openAdmins() {
  document.getElementById("users").classList.toggle("translatefull")
}

function closeProfile() {
  document.getElementById("mainSetting").style.display = "none"
  document.getElementById("profileSetting").style.display = "none"
  document.getElementById("alertSetting").style.display = "none"
  document.getElementById("passwordSetting").style.display = "none"
  document.querySelector("#settingContainer").style.display = "none"
}


useEffect(() => {
fetchUserData()
}, [currentUser])

useEffect(() => {
  fetchAdmins()

}, [])

const handleProfileSubmit = async (e) => {
  e.preventDefault()
  console.log(userInfo)
  let displayName = e.target[1].value
  await updateDoc(doc(db, "admins", currentUser.uid),{
    displayName,
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

    return ( 

<div className="home-left" id='homeleft'>

<div className="header">
    <div className="logo"><img src={logobg} alt="" /></div>
    <div className="setting" onClick={userInfo && openSettings}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#b6b4b4" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="48" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><path d="M197.4,80.7a73.6,73.6,0,0,1,6.3,10.9L229.6,106a102,102,0,0,1,.1,44l-26,14.4a73.6,73.6,0,0,1-6.3,10.9l.5,29.7a104,104,0,0,1-38.1,22.1l-25.5-15.3a88.3,88.3,0,0,1-12.6,0L96.3,227a102.6,102.6,0,0,1-38.2-22l.5-29.6a80.1,80.1,0,0,1-6.3-11L26.4,150a102,102,0,0,1-.1-44l26-14.4a73.6,73.6,0,0,1,6.3-10.9L58.1,51A104,104,0,0,1,96.2,28.9l25.5,15.3a88.3,88.3,0,0,1,12.6,0L159.7,29a102.6,102.6,0,0,1,38.2,22Z" fill="none" stroke="#b6b4b4" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div>
</div>

<div className="search-messages">
    <div className="search-icon"><svg data-v-27514174="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-27514174="" d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path data-v-27514174="" d="M17.5 17.5L13.875 13.875" stroke="#9999BC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><input type="text" onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} name="search" id="search" className="search" placeholder='Search Messages...' />
</div>


    {users?<div className="messages messagesone">
    {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
          <div className="message-item" key={chat[0]} onClick={() => openChat(chat[1].userInfo)}>
            {/* <div className="first-col"><img src={users[users.findIndex(user => user.uid == chat[1].userInfo.uid)].photoURL} alt="" /></div> */}
            <div className="second-col">
            <div className="first-row">{users[users.findIndex(user => user.uid == chat[1].userInfo.uid)].firstName}</div>
                <div className="second-row">{}</div>
            </div>
            <div className="third-col"></div>
        </div>
        ))}
    </div>:<div>Loading</div>}


    
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


    <div className="profile-container setting-container" id='settingContainer'>
            {userInfo? <div className="settings " id='mainSetting'>
                <div className="h3">Settings</div>
                <div className="xx" onClick={closeProfile}>x</div>
                <div className="title">PROFILE</div>
                <div className="profile-settings setting-item" onClick={openProfileSetting}>
                    <img className='profile-photo photo-setting' src={fileURL? fileURL: currentUser.photoURL} alt="" />
                    <div className="profile-others">
                        <div className="profile-name">{userInfo.displayName}</div>
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
                <img src={fileURL? fileURL: currentUser.photoURL} className="profile-photo" alt="Profile Photo" /> <input type="file" name="file" id="file" onChange={changePic}/></div>
                <span>Tap to change profile photo</span>
                {loading && <p>Uploading...</p>}
            </div>
            <label htmlFor="firstname">DisplayName</label> 
            <input type="text" name="firstname" defaultValue={userInfo && userInfo.displayName} required id="firstname" /> 
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
 
export default AdminLeft;