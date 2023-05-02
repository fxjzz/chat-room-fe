import styled from "styled-components";
import p from "../../public/pictures/1bzhan.jpg";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserList from "@/components/UserList";
import ChatContent from "@/components/ChatContent";

function Chat() {
  const username = useSelector((state: any) => state.username.value);
  const [currentChat, setCurrentChat] = useState<{ username: string }>();

  return (
    <Wrapper>
      <img src={p.src} className="chatbg" alt="x" />
      <Content>
        <header>Hi ! 欢迎用户 {username} 进入聊天室</header>
        <Main>
          <UserList
            userName={username}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
          />
          <ChatContent currentChat={currentChat} userName={username} />
        </Main>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .chatbg {
    position: absolute;
    z-index: -999;
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
`;

const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(198, 229, 250, 0.6);
  height: 100vh;
  header {
    color: #666666;
    width: 98%;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 3px;
  }
`;
const Main = styled.div`
  overflow: hidden;
  display: flex;
  margin-top: 4px;
  width: 98%;
  height: 90%;
  border-radius: 4px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 3px;
`;

export default Chat;
