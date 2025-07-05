import ChatContainer from "@/components/ChatContainer";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/contexts/ChatContext";
import { wsController } from "@/socket";
import { useEffect, useState } from "react";

const Index = () => {
  const context = useChatContext();
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("Connecting to WebSocket with username:", context.username);

    if (username != "")
      context.dispatch({
        type: "CONNECT_SOCKET",
        payload: wsController.connect(context.username),
      });
  }, [context.username]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {context.username === "" && (
        <div className="w-[100%] bg-[#000000a6] h-[100%] z-[10] flex justify-center items-center fixed top-0 left-0  z-[-1]">
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.trim() !== "") {
                console.log("Setting username:", username.trim());
                context.dispatch({
                  type: "SET_USERNAME",
                  payload: username.trim(),
                });
              }
            }}
            placeholder="Enter your username"
            className="w-[300px] h-[50px] text-center"
            autoFocus
            autoComplete="off"
            spellCheck="false"
            maxLength={20}
            minLength={3}
            type="text"
          />
        </div>
      )}
      <ChatContainer />
    </div>
  );
};

export default Index;
