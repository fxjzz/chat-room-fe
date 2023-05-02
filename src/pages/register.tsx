import p from "../../public/pictures/loginbg.jpg";
import styled from "styled-components";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { changeName } from "@/store/store";
import { http } from "@/http/http";

function Register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onRegister = async (values: any) => {
    const formData: any = {
      username: values.username,
      password: values.password,
      avatar: `https://api.multiavatar.com/fxjzz-avatar${Math.floor(
        Math.random() * 10000
      )}.svg`,
    };
    let user;
    try {
      user = await http.post("auth/register", formData);
    } catch {
      throw new Error("注册失败");
    }
    dispatch(changeName(formData.username));
    localStorage.setItem("jwt", user.data.access_token);
    router.push("/chat");
  };

  const validatePwd = ({ getFieldValue = new Function() }) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("两次输入的密码不一致"));
    },
  });

  return (
    <Container>
      <img src={p.src} className="login" alt="x" />
      <WrapperFrom>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          onFinish={onRegister}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请再次输入密码!" },
              validatePwd,
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 3 }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </WrapperFrom>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .login {
    position: absolute;
    z-index: -999;
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
`;

const WrapperFrom = styled.div`
  width: 300px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  .ant-form-item {
    margin-top: 12px;
    margin-bottom: 6px;
  }
`;

export default Register;
