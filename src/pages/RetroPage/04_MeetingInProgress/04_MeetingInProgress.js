// React
import { useState, useEffect } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";

// Custom componenets
import RetroColumn from "./RetroColumn/RetroColumn";

// Socket.io Client
import { io } from "socket.io-client";

export default function MeetingInProgress({ props }) {
  const {
    meeting,
    setMeeting,
    addCard,
    deleteCard,
    updateCardText,
    updateCardVotes,
    moveCard,
    participant,
    socket,
    setSocket,
  } = props;

  // Start the meeting
  useEffect(() => {
    if (!meeting.meetingStarted) {
      setMeeting({ ...meeting, meetingStarted: true });
    }
  });

  // Establish socket.io connection
  useEffect(() => {
    if (!socket) {
      // Destructure relevant info for connection
      const { roomId } = meeting;
      const { name, isFacilitator, avatar } = participant;

      // Establish socket connection
      setSocket(
        io("http://localhost:8080", {
          query: {
            roomId,
            name,
            isFacilitator,
            avatar,
          },
        })
      );
    }

    if (socket) {
      //// 👉 2 types of sources - local, and socket
      ////// 👉  With socket, we only render, but don't emit the card, to avoid an infinite loop
      ////// 👉  With local, we render AND emit the card, to send it to other participants
      const source = "socket";

      // Notification rules
      socket.on("notification", (notification) => {
        // FIXME: Do stuff......
      });

      //// "Receive" rules
      // Add
      socket.on("addCard", (card) => {
        addCard({ source, card });
      });

      // Delete
      socket.on("deleteCard", (id) => {
        deleteCard({ source, id });
      });

      // Update Text
      socket.on("updateCardText", ({ id, content }) => {
        updateCardText({ source, id, content });
      });

      // Update Votes
      socket.on("updateCardVotes", ({ id, thumb }) => {
        updateCardVotes({ source, id, thumb });
      });

      // Move card
      socket.on("moveCard", ({ id, direction }) => {
        moveCard({ source, id, direction });
      });
    }
  }, [
    addCard,
    deleteCard,
    meeting,
    moveCard,
    participant,
    setSocket,
    socket,
    updateCardText,
    updateCardVotes,
  ]);

  return (
    <div>
      {/* TODO: Need some sexy logic here, where the server determines the time of the meeting*/}
      {/* <TimerPartyParrotHorizontal
          props={{
            totalTime: 600,
            timeLeft: 600,
          }}
        /> */}
      <div>
        <Grid
          className="retroBoardContainer"
          container
          spacing={2}
          wrap="nowrap"
        >
          {meeting.columns.map((columnTitle, index) => (
            <RetroColumn
              key={`${columnTitle}_card${index}`}
              props={{
                meeting,
                setMeeting,
                columnTitle,
                index,
                addCard,
                updateCardText,
                updateCardVotes,
                deleteCard,
                moveCard,
                cards: meeting.cards.filter((card) =>
                  card.columnIndex === index && !card.isDeleted ? true : false
                ),
                participant,
              }}
            ></RetroColumn>
          ))}
        </Grid>
      </div>
    </div>
  );
}
