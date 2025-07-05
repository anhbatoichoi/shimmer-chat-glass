export type ChatData = {
  message: string;
  room: string;
  to: string;
  action: Action;
  username: string;
};

export type SocketResponse = {
  type: "message" | "info" | "error" | "broadcast" | "echo";
  data: ChatData;
};

export type Action =
  | "typing"
  | "stop_typing"
  | "send_message"
  | "join_room"
  | "leave_room";
