import firebase from "firebase";
import "@firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBYiYsFOs7ybliCmISaOy08wo-pyhtrMvU",
  authDomain: "todoappnative-4074b.firebaseapp.com",
  databaseURL: "https://todoappnative-4074b.firebaseio.com",
  projectId: "todoappnative-4074b",
  storageBucket: "todoappnative-4074b.appspot.com",
  messagingSenderId: "537098881971",
  appId: "1:537098881971:web:5894293757e09d4f79d9c6",
};
// Initialize Firebase

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref

    this.unsubscribe = ref.onSnapshot(snapshot => {
        lists = []

        snapshot.forEach(doc => {
            lists.push({ id: doc.id, ...doc.data() })
        })
        console.log(lists)
        callback(lists)
    })
  }

  addList(list) {
      let ref = this.ref
      ref.add(list)
  }

  deleteList(list){
    let ref = this.ref;
    ref.doc(list.id).delete()
}

  updateList(list) {
      let ref = this.ref
      ref.doc(list.id).update(list)
  }

  get userId() {
      return firebase.auth().currentUser.uid
  }

  detach() {
      this.unsubscribe();
  }

  get ref() {
      return firebase
      .firestore()
      .collection("lists");
  }
}

export default Fire;
