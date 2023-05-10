import React from 'react'
import { useState, createContext, useContext, useRef } from "react";
import { signOut, updateProfile } from 'firebase/auth';

import OneSignalReact from 'react-onesignal';
import { getMessaging, getToken } from "firebase/messaging";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/chatContext';
import { db, storage} from "../firebase";
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import {v4 as uuid} from "uuid"
import { async } from '@firebase/util';


const HomeRight = () => {
    const user = useContext(AuthContext)
    const textInput = useRef();
    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)
    const [userInfo, setUserInfo] = useState(null)
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")
    const [img, setImg] = useState(null)
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [admins, setAdmins] = useState([]);
    const [err, setErr] = useState([]);
    const [loading, setLoading] = useState();
    const [message, setMessage] = useState('');
    const [file2, setFile2] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [notice, setNotice] = useState(false);




    const handleEnter = (e) => {
    e.code === "Enter" && handleSend();
}

// const messaging = getMessaging();
// // Add the public key generated from the console here.
// getToken(messaging, {vapidKey: "BKaZ9wRCilbQ8u341LEn7gey53bpT15LI3SpaDhDKuYL8Z1YZhG14SPzP_jTSG89hQbi8IUoTWk0R3sgO1S7Yao"});
// useEffect(() => {
//   if (notice == false){
    
//   }
// }, [])


  const handleSendImg = async() =>{
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      alert("File is being uploaded")
      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => { getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
          });
        }
      );
      
    } 


  }

  


    const handleSend = async() =>  {
        if (text === "") {
          
        } else {
          textInput.current.value = ""
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            }),
          })
        }
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]:{
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]:{
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
    }
        
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
          doc.exists() && setMessages(Object.entries(doc.data().messages));
        });
    
        return () => {
          unSub();
        };
      }, [data.chatId]);

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

  

  const [fileURL, setFileURL] = useState(null);

async function changePic(e) {

  setLoading(true);
  setFile(e.target.files[0]);
  
}

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



OneSignalReact.getUserId().then(userId => {
  updateDoc(doc(db, "users", currentUser.uid),{
    userId,
    })
});



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

const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BKaZ9wRCilbQ8u341LEn7gey53bpT15LI3SpaDhDKuYL8Z1YZhG14SPzP_jTSG89hQbi8IUoTWk0R3sgO1S7Yao' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    console.log(currentToken)
            updateDoc(doc(db, "users", currentUser.uid),{
            currentToken,
       })
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
  

useEffect(() => {
  pic()

}, [file])

useEffect(() => {
  handleSendImg()
}, [img])

// document.addEventListener('DOMContentLoaded', () => {
//   const rootElement = document.querySelector('#picker');
//   const selectionContainer = document.querySelector('#selection-outer');
//   const emoji = document.querySelector('#selection-emoji');
//   const name = document.querySelector('#selection-name');

//   const picker = createPicker({
//     rootElement
//   });

//   picker.addEventListener('emoji:select', (selection) => {
//     emoji.innerHTML = selection.emoji;
//     name.textContent = selection.label;

//     selectionContainer.classList.remove('empty');
//   });
// });



useEffect(() => {
  fetchAdmins()
}, [])



  useEffect(() => {
    fetchUserData()

}, [currentUser])
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

    function goBack() {
        
  document.getElementById("headerRight").style.display = "none"
  document.getElementById("homeleft").style.display = "grid"
  document.getElementById("homeright").style.display = "none"
    }

    useEffect(() => {
        function getChats() {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
        }
        currentUser.uid && getChats()
    }, [currentUser])

    return ( 
        <div className="home-right" id='homeright'>
        <div className="chat-header" id='headerRight'>
            <div className='back-btn' id='backbtn' onClick={goBack}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#8a8f8a" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="216" y1="128" x2="40" y2="128" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="112 56 40 128 112 200" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg></div>
            <div className='chat-details'>
            <div className="avatar message-avatar" id='avatar'><img src={data.user.uid && admins[admins.findIndex(admin => admin.uid === data.user.uid)].photoURL} alt="" /></div>
            <div className="message-chat-name">{data.user?.displayName}</div>
            </div>
            <div className="message-options" onClick={openContact}><div onClick={showProfile} className="contact-info" id='contactInfo'><span on>Contact info</span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#0d0d0d" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="96" r="64" fill="none" stroke="#0d0d0d" stroke-miterlimit="10" stroke-width="16"></circle><path d="M31,216a112,112,0,0,1,194,0" fill="none" stroke="#0d0d0d" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg></div><svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2C4 1.60444 3.8827 1.21776 3.66294 0.888858C3.44318 0.55996 3.13082 0.303614 2.76537 0.152239C2.39992 0.000863686 1.99778 -0.0387431 1.60982 0.0384275C1.22186 0.115598 0.865492 0.30608 0.585787 0.585785C0.306082 0.86549 0.115601 1.22186 0.0384302 1.60982C-0.0387402 1.99778 0.000866492 2.39991 0.152242 2.76537C0.303617 3.13082 0.559962 3.44318 0.88886 3.66294C1.21776 3.8827 1.60444 4 2 4C2.53043 4 3.03914 3.78928 3.41421 3.41421C3.78929 3.03914 4 2.53043 4 2ZM14 2C14 2.39556 14.1173 2.78224 14.3371 3.11114C14.5568 3.44004 14.8692 3.69638 15.2346 3.84776C15.6001 3.99913 16.0022 4.03874 16.3902 3.96157C16.7781 3.8844 17.1345 3.69392 17.4142 3.41421C17.6939 3.13451 17.8844 2.77814 17.9616 2.39018C18.0387 2.00222 17.9991 1.60008 17.8478 1.23463C17.6964 0.869179 17.44 0.556821 17.1111 0.337059C16.7822 0.117296 16.3956 -2.14718e-06 16 -2.12989e-06C15.4696 -2.10671e-06 14.9609 0.210712 14.5858 0.585785C14.2107 0.960857 14 1.46956 14 2ZM7 2C7 2.39556 7.1173 2.78224 7.33706 3.11114C7.55682 3.44004 7.86918 3.69638 8.23463 3.84776C8.60009 3.99913 9.00222 4.03874 9.39018 3.96157C9.77814 3.8844 10.1345 3.69392 10.4142 3.41421C10.6939 3.13451 10.8844 2.77814 10.9616 2.39018C11.0387 2.00222 10.9991 1.60008 10.8478 1.23463C10.6964 0.869179 10.44 0.556822 10.1111 0.337059C9.78224 0.117296 9.39556 -1.8412e-06 9 -1.82391e-06C8.46957 -1.80073e-06 7.96086 0.210712 7.58579 0.585785C7.21071 0.960858 7 1.46957 7 2Z" fill="#51545C"></path></svg></div>
        </div>
        <div className="chats" onClick={hideContact}>
        <div className="message-items">
                {/* <div className="owner">hello</div>
                <div className="other">how are you doing</div>
                <div className="owner">I'm fine thank you</div>
                <div className="other">Okay i just want to let you know I'm back</div> */}
        {messages?.sort((a,b)=>a[1].date - b[1].date).map((chat) => (
          <div className={currentUser.uid === chat[1].senderId? "owner": "other"}
           key={chat[0]}>
            {chat[1].img? <a href={chat[1].img} download><img className='chat-image' src={chat[1].img}/></a>: <span>{chat[1].text}</span> }
           </div>

           
        ))}
            </div>
        </div>
        <div className="chat-footer">
            {/* <div className="emoji-container" id="picker"></div> */}
            <div className="import-media"><svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8a8f8a" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><polyline points="152 32 152 88 208 88" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><line x1="104" y1="152" x2="152" y2="152" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="128" y1="128" x2="128" y2="176" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg><input type="file" name="file" id="file" onChange={(e) => setImg(e.target.files[0])}/></div>
            <div className="chat-input">
                <div>
                {/* <svg  id='trigger' className='trigger' xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="#8a8f8a" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><circle cx="92" cy="108" r="12"></circle><circle cx="164" cy="108" r="12"></circle><path d="M169.6,152a48.1,48.1,0,0,1-83.2,0" fill="none" stroke="#8a8f8a" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg> */}
                </div>
                <input ref={textInput} onKeyDown={handleEnter} type="text" name="message" id="message" onChange={(e)=>setText(e.target.value)} />
            </div>
            <div className="record-voice" onClick={handleSend}><svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="#008000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M219.5,121,50.6,26.4a8,8,0,0,0-11.4,9.7L71,125.3a7.2,7.2,0,0,1,0,5.4L39.2,219.9a8,8,0,0,0,11.4,9.7L219.5,135A8,8,0,0,0,219.5,121Z" fill="none" stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><line x1="72" y1="128" x2="136" y2="128" fill="none" stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg></div>
        </div>
        <div className="profile-container" onClick={closeProfile}>
        </div>
        {userInfo && <div className="profile-details">
            <h3>Customer's Details</h3>
            <div className="profile-photo"><img src={fileURL? fileURL: currentUser.photoURL} alt="" /></div>
            <div className="displayName">{userInfo.firstName + " " + userInfo.lastName}</div>
            <div className="phone-num">{userInfo.phone}</div>
            <div className="email">{userInfo.email}</div>
            <div class="x" onClick={closeProfile}>x</div>

            </div>}

    </div>
     );
}

export default HomeRight;