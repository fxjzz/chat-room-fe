import styled from "styled-components";
import p from "../../public/pictures/loginbg.jpg";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { http } from "@/http/http";
import { useDispatch } from "react-redux";
import { changeName } from "@/store/store";

type FormData = {
  username: string;
  password: string;
};

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogin = async (formData: FormData) => {
    http.post("auth/login", { formData }).then((res) => {
      dispatch(changeName(formData.username));
      localStorage.setItem("jwt", res.data.access_token);
      router.push("/chat");
    });
  };

  return (
    <Container>
      <img src={p.src} className="login" alt="x" />
      <WrapperForm>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          size="large"
          onFinish={onLogin}
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

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button id="btn" type="primary" htmlType="submit">
              登录
            </Button>

            <Link href="/register">
              <Button type="primary" htmlType="button">
                注册
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </WrapperForm>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
const WrapperForm = styled.div`
  width: 300px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  .ant-form-item {
    margin-top: 12px;
    margin-bottom: 6px;
  }
  #btn {
    margin-right: 60px;
  }
`;

export default Login;
