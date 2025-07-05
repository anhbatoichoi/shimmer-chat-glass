class WsController {
  ws: WebSocket;

  connect(username: string): WebSocket {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = "localhost:3000"; // Replace with your server's host if different
    const wsUrl = `${protocol}//${host}?userId=${username}`;
    this.ws = new WebSocket(wsUrl);
    this.ws.addEventListener("open", () => {
      console.log("WebSocket connection established");
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);
      // Handle incoming messages here
    };

    this.ws.addEventListener("close", () => {
      // try to reconnect after 5 seconds
      setTimeout(this.connect, 5000);
    });

    this.ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    return this.ws;
  }
}

export const wsController = new WsController();
