import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthProvider";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  deleteChatHistory,
  getChatHistory,
  sendChatRequest,
} from "../helpers/api-communicators";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleClearChat = async () => {
    try {
      toast.loading("Cancello la conversazione...", {
        id: "clearChat",
      });
      await deleteChatHistory();
      setChatMessages([]);
      toast.success("Conversazione cancellata", { id: "clearChat" });
    } catch (err) {
      console.log(err);
      toast.error("Errore nella cancellazione della conversazione", {
        id: "clearChat",
      });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Caricamento chats storica...", {
        id: "loadHistory",
      });
      getChatHistory()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Chat storica caricata", { id: "loadHistory" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Errore nel caricamento delle chats storiche", {
            id: "loadHistory",
          });
        });
    }
  }, [auth]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", sx: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "50vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1][0]}
          </Avatar>
          <Typography
            sx={{
              mx: "auto",
            }}
          >
            Sono il tuo tutore personale di Matematica.
          </Typography>
          <Typography
            sx={{
              mx: "auto",
              p: 2,
              my: 2,
            }}
          >
            Puoi chiedermi qualsiasi cosa riguardo la Matematica, ti aiuterò a
            capire i concetti e le formule.
          </Typography>
          <Button
            onClick={handleClearChat}
            sx={{
              width: "200px",
              mx: "auto",
              my: "auto",
              color: "white",
              fontWeight: 700,
              borderRadius: 7,
              bgcolor: red[300],
              "&:hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Cancella la conversazione
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: 600,
          }}
        >
          Model - GPT-4o mini
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem
              key={index}
              content={chat.content}
              role={chat.role as "user" | "assistant"}
            />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            //padding: "20px",
            borderRadius: 8,
            backgroundColor: "rgb(17,29,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {"   "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "20px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
            placeholder="Scrivi qui..."
          />
          <IconButton onClick={handleSubmit} sx={{ mx: 1, color: "white" }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
