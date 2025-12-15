import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  message,
  Descriptions,
  Typography,
  Spin,
  Card,
  Space,
  Tag // ✅ Added
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const BASE_URL = "https://recommendation-8-c47c.onrender.com/api/books";

const AddRecommendation = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    const payload = {
      bookName: values.bookName.trim(),
      author: values.author.trim(),
    };

    try {
      const { data } = await axios.post(BASE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      });

      if (!data) throw new Error("No data received from server");

      const result = {
        id: data.bookId || data.id || "N/A",
        bookName: data.bookName || data.title || payload.bookName,
        author: data.author || payload.author,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      message.success("Book added successfully!");
      setResponseData(result);
      form.resetFields();
      onSuccess && onSuccess(); // optional chaining
    } catch (error) {
      console.error("Add book error:", error);

      let errorMessage = "Failed to add book. Please try again.";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<Title level={4}>Add New Book Recommendation</Title>}
      style={{ maxWidth: 800, margin: "0 auto" }}
      bordered={false}
      headStyle={{ borderBottom: 0 }}
    >
      <Spin spinning={loading} tip="Submitting book...">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          size="large"
        >
          <Form.Item
            label={<Text strong>Book Name</Text>}
            name="bookName"
            rules={[
              { required: true, message: "Please enter the book name", whitespace: true },
              { min: 2, message: "Book name must be at least 2 characters" },
              { max: 100, message: "Book name must be less than 100 characters" },
            ]}
            validateFirst
          >
            <Input placeholder="Enter book title" allowClear showCount maxLength={100} />
          </Form.Item>

          <Form.Item
            label={<Text strong>Author</Text>}
            name="author"
            rules={[
              { required: true, message: "Please enter the author's name", whitespace: true },
              { min: 2, message: "Author name must be at least 2 characters" },
              { max: 50, message: "Author name must be less than 50 characters" },
            ]}
            validateFirst
          >
            <Input placeholder="Enter author name" allowClear showCount maxLength={50} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ width: 180 }}
              >
                {loading ? "Submitting..." : "Submit Book"}
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()} size="large">
                Reset Form
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {error && (
          <div style={{ marginTop: 24 }}>
            <Text type="danger">
              <strong>Error:</strong> {error}
            </Text>
          </div>
        )}

        {responseData && (
          <Card style={{ marginTop: 24 }} bordered={false} bodyStyle={{ padding: 0 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <CheckCircleOutlined
                style={{ color: "#52c41a", fontSize: 24, marginRight: 8 }}
              />
              <Title level={5} style={{ margin: 0 }}>
                Successfully Added Book
              </Title>
            </div>

            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{ fontWeight: "bold", width: "120px" }}
            >
              <Descriptions.Item label="ID">
                <Tag color="blue">{responseData.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Book Name">
                {responseData.bookName}
              </Descriptions.Item>
              <Descriptions.Item label="Author">
                {responseData.author}
              </Descriptions.Item>
              {responseData.createdAt && (
                <Descriptions.Item label="Created At">
                  {new Date(responseData.createdAt).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Spin>
    </Card>
  );
};

export default AddRecommendation;
