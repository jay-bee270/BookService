import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";

const BASE_URL = "http://172.193.176.39:8081/api/books";

const EditRecommendation = ({ book, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Validate book prop
  if (!book || !book.id || !book.bookName || !book.author) {
    return (
      <Card title="Error">
        <p>Invalid book data. Please select a valid book.</p>
        <Button onClick={onCancel}>Back</Button>
      </Card>
    );
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/${book.id}`, values);
      message.success("Book updated successfully");
      onSuccess();
    } catch (error) {
      message.error("Failed to update book");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={`Edit Book: ${book.bookName}`} bordered={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          bookName: book.bookName,
          author: book.author,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="bookName"
          label="Book Name"
          rules={[{ required: true, message: "Please input book name!" }]}
        >
          <Input placeholder="Enter book name" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please input author name!" }]}
        >
          <Input placeholder="Enter author name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Book
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 16 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditRecommendation;