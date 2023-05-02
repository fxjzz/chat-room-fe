import { http } from "@/http/http";
import { Image } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

function UserList({
  userName = "xxx",
  setCurrentChat = new Function(),
  currentChat = { username: "x" },
}) {
  const [userList, setUserList] = useState<User[]>([]);
  const toggleChat = (user: User) => {
    setCurrentChat(user);
  };

  useEffect(() => {
    const getUserList = async () => {
      const users = await http.get("user");
      //过滤自己。
      const filteredUsers = users.data.filter(
        (user: { username: string }) => user.username !== userName
      );
      setUserList(filteredUsers);
      setCurrentChat(filteredUsers[0] || null);
    };
    getUserList();
  }, [userName, setCurrentChat]);

  return (
    <Content>
      <div className="msg">近期消息</div>
      <div className="wrapper">
        <ul>
          {userList &&
            userList.map((user) => (
              <li
                key={user.username}
                className={currentChat === user ? "selected" : ""}
                onClick={() => toggleChat(user)}
              >
                <Image src={user.avatar} alt="xxx" width={40}></Image>
                <div>
                  <span>{user.username}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </Content>
  );
}

const Content = styled.div`
  height: 100%;
  width: 20%;
  border-right: 1px solid #e9eaec;
  .msg {
    font-size: 4px;
    padding: 7px 12px;
    border-bottom: 0.5px solid #e9eaec;
    position: sticky;
    top: 0;
    overflow: hidden;
    background: white;
  }
  .wrapper {
    height: 812px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
    .selected {
      background: #e4e5e6;
    }
    li {
      width: 100%;
      padding: 19px 24px;
      display: flex;
      align-items: center;
      div {
        margin-right: auto;
      }
      &:hover {
        background: #e4e5e6;
      }
    }
  }
`;

export default UserList;
