import { createSlice } from "@reduxjs/toolkit";
import { clients } from "../../data/clientData";

function getMessages() {
  const map = {};

  for (const client of clients) {
    map[client.clientID] = [
      {
        type: "client",
        msg: client.lastMessage,
      },
    ];
  }

  return map;
}

const initialState = {
  total_clients: clients,
  messages: getMessages(),
};

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    updateClients: (state, action) => {
      state.total_clients = action.payload;
    },

    // send message
    addMessage: (state, action) => {
      const messages = state.messages;
      const { clientID, msg } = action.payload;

      messages[clientID].push({ type: "admin", msg: msg });
    },

    // remove all
    removeAllClients: (state, action) => {
      state.total_clients = [];
      state.messages = {};
    },
  },
});

export const { updateClients, addMessage, removeAllClients } =
  clientSlice.actions;
export default clientSlice.reducer;
