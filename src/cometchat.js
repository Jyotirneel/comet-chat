import '@cometchat/chat-sdk-javascript';

const CometChat = window.CometChat;

const APP_ID = import.meta.env.VITE_COMETCHAT_APP_ID;
const REGION = import.meta.env.VITE_COMETCHAT_REGION;
const AUTH_KEY = import.meta.env.VITE_COMETCHAT_AUTH_KEY;

let initialized = false;

export async function initCometChat() {
  if (initialized) return;

  console.log("CometChat object:", CometChat);

  const appSettings = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(REGION)
    .build();

  await CometChat.init(APP_ID, appSettings);

  initialized = true;
  console.log("CometChat initialized");
}

export async function loginUser(uid) {
  return await CometChat.login(uid, AUTH_KEY);
}

export async function logoutUser() {
  return await CometChat.logout();
}

export { CometChat };