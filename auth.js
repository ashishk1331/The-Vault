function addUser(email,password){
  auth.createUserWithEmailAndPassword(email,password)
  .then( (cred) => {
    console.log(cred);
    addToUsersCollection(cred.user.uid,cred.user.email);
    setEmail(cred.user.email);
    active_user(true);
  })
  .catch( (err) => {
    showError(err.message);
    console.log(err);
  });
}

function signInUser(email,password){
  auth.signInWithEmailAndPassword(email,password)
  .then( (cred) => {
    setEmail(cred.user.email);
    active_user(true);
  })
  .catch( (err) => {
    showError(err.message)
    console.log(err);
  });
}

function logOutUser(){
  auth.signOut()
  .then( () => {
    active_user(false);
    emptyTheLinkList();
  })
  .catch( (err) => {
    showError(err.message)
    console.log(err);
  });
}

auth.onAuthStateChanged( (user) => {
  if(user)
  {
    setEmail(user.email);
    active_user(true);
    getLinkList(user.email);
  }
  else{
    active_user(false);
  }
});

function addToUsersCollection(uid,name){
  const username = name.substring(0,name.indexOf('@'));
  db.collection('Users').doc(uid+'').set({name:username,bio:''})
  .then( () => console.log('Made the doc succesfully.'))
  .catch( (err) => {
    showError(err.message);
    console.log(err)
  });
}

function addLinkToUserLinkDatabase(email,name,link,date){
  db.collection(email).doc(name).set({ 
    link : link,
    date : date
   }).then( () => console.log('Link saved.'))
   .catch( (err) => {
     showError(err.message);
     console.log(err)
  });
  appendToList(name,link,date);
}

function getLinkList(email){
      db.collection(email).get().then( snapshot => {
          snapshot.forEach(element => {
            console.log(element.id);
            const li = element.data();
            appendToList(element.id,li.link,li.date);  
          });
      }).then( () => "Got all previously stored links.").catch( (err) => console.log(err));
      updateNumberOfLinks();
}

function deleteLink(email,name){
    db.collection(email).doc(name).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      showError(err.message);
      console.error("Error removing document: ", error);
  });
}