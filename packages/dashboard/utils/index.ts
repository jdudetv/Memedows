import firebase from "firebase/app";

const clearFirestoreCache = () => {
  const map = globalThis["_reactFirePreloadedObservables"];
  Array.from(map.keys()).forEach(
    (key: string) => key.includes("firestore") && map.delete(key)
  );
};

export const logout = () => {
  firebase.auth().signOut();
  clearFirestoreCache();
};

export const camelToSentence = (camel: string) => {
  // adding space between strings
  const result = camel.replace(/([A-Z])/g, " $1");

  // converting first character to uppercase and join it to the final string
  return result.charAt(0).toUpperCase() + result.slice(1);
};
