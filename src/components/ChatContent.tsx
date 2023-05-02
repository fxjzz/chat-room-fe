import { wsHOST } from "@/http/config";
import { http } from "@/http/http";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";

function ChatContent({ currentChat = { username: "xxx" }, userName = "x" }) {
  const socket = io(wsHOST);
  const [msg, setMsg] = useState<string>("");
  const text = useRef<HTMLTextAreaElement>(null);
  const [msgList, setMsgList] = useState([
    {
      sender: "",
      content: "",
      receiver: "",
      userId: "",
      createAt: Date,
    },
  ]);
  const msgBox = useRef<HTMLDivElement | null>(null);
  const toScreenBottom = () => {
    const scrollHeight = msgBox.current?.scrollHeight;
    const scrollTop = msgBox.current?.scrollTop;
    const clientHeight = msgBox.current?.clientHeight;

    const animateScroll = (timestamp: any) => {
      const progress = (timestamp - startTime) / duration;
      const newY =
        scrollTop! + (scrollHeight! - clientHeight!) * easeInOutQuad(progress);

      msgBox.current?.scrollTo(0, newY);

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    const easeInOutQuad = (t: any) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const duration = 500; // 滚动动画持续时间
    const startTime = performance.now(); // 开始时间戳

    window.requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    socket.emit(
      "connection",
      async (socket: { join: (arg0: string) => any; id: any }) => {
        await socket.join(userName);
      }
    );
    return () => {
      socket.close();
    };
  }, [socket, userName]);

  useEffect(() => {
    async function getMsgList() {
      const res = await http.post("message/list", {
        username: userName,
        currentChater: currentChat.username,
      });

      res.data.data.messageList.sort(
        (a: { createAt: number }, b: { createAt: number }) => {
          return (
            new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
          );
        }
      );
      setMsgList(res.data.data.messageList);
      setTimeout(toScreenBottom, 100);
    }
    setMsgList([]);
    if (currentChat.username !== undefined) {
      getMsgList();
    }
  }, [currentChat.username, userName]);

  useEffect(() => {
    async function getMsgList() {
      const res = await http.post("message/list", {
        username: userName,
        currentChater: currentChat.username,
      });

      res.data.data.messageList.sort(
        (a: { createAt: number }, b: { createAt: number }) => {
          return (
            new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
          );
        }
      );
      setMsgList(res.data.data.messageList);
      setTimeout(toScreenBottom, 100);
    }
    socket.on("showMessage", getMsgList);
    return () => {
      socket.off("showMessage");
    };
  });

  const inputMsg = (e: any) => {
    setMsg(e.target.value);
  };

  const sendMsg = async () => {
    http
      .post("message/send", {
        sender: userName,
        receiver: currentChat.username,
        content: msg,
      })
      .then(
        () => {
          console.log("发送成功");
          socket.emit("sendMessage", {
            to: currentChat,
          });
          text.current!.value = "";
          toScreenBottom();
        },
        (err) => {
          console.log("发送失败");
        }
      );
  };

  return (
    <Content>
      <div className="title">{currentChat && currentChat.username}</div>
      <div className="chat">
        <div className="message" ref={msgBox}>
          {msgList &&
            msgList.map((m) => (
              <div
                key={m.userId}
                className={m.sender === userName ? "right" : "left"}
              >
                <div className="msg-box">{m.content}</div>
              </div>
            ))}
        </div>
        <div className="input-box">
          <textarea className="text" onInput={inputMsg} ref={text} />
          <div className="send">
            <span>{msg.length} / 500</span>
            <Button type="primary" onClick={sendMsg}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </Content>
  );
}

const Content = styled.div`
  height: 100%;
  width: 80%;
  display: flex;
  position: relative;
  flex-direction: column;
  .title {
    position: absolute;
    padding: 2px 8px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e9eaec;
    background: white;
  }
  .chat {
    width: 100%;
    height: 100%;
    padding: 32px 0 0 0;
    background: #f4f5f7;
    > .message {
      padding: 0 12px;
      overflow-y: scroll;
      ::-webkit-scrollbar {
        width: 7px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
      width: 100%;
      height: 80%;
      .right {
        padding: 0px 16px 16px 16px;
        min-height: 48px;
        display: flex;
        flex-direction: row-reverse;
        .msg-box {
          word-break: break-word;
          word-wrap: break-word;
          padding: 8px 16px 8px 16px;
          background: #80b9f2;
          color: white;
          border-radius: 16px 16px 0 16px;
        }
      }
      .left {
        padding: 0px 16px 16px 16px;
        min-height: 48px;
        display: flex;
        .msg-box {
          word-break: break-word;
          word-wrap: break-word;
          padding: 8px 16px 8px 16px;
          background: white;
          border-radius: 0px 16px 16px 16px;
        }
      }
    }
    > .input-box {
      width: 100%;
      height: 20%;
      padding: 16px;
      border-top: 1px solid #e9eaec;

      .text {
        background: #f4f5f7;
        font-size: larger;
        resize: none;
        display: block;
        width: 100%;
        height: 86px;
        padding: 4px;
        border: none;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
        &:focus {
          outline: none;
        }
      }
      .send {
        font-size: 4px;
        float: right;
        button {
          margin-left: 12px;
          width: 100px;
        }
      }
    }
  }
`;

export default ChatContent;
