import React, { useState } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { config } from "zeroetp-api-sdk";

export interface ImageUploadProps {
  onChange?: any;
  value?: any;
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  let defaultFileList = [];
  if (value) {
    if (Array.isArray(value)) {
      defaultFileList = value;
    } else {
      defaultFileList = [value];
    }
  }
  defaultFileList = defaultFileList.map((file) => ({
    name: "图片",
    url: file,
    uid: file,
    status: "done",
  }));

  const [fileList, setFileList] = useState<any[]>(defaultFileList);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<any>();

  const getUploadProp = () => {
    return {
      name: "file",
      action: `${config.API_URL}/api/v1/util/uploadImage`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    };
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload
        accept="image/*"
        {...getUploadProp()}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={({ fileList: newFileList }) => {
          if (onChange) {
            if (newFileList.length === 1) {
              // TODO: 先做一个的
              const [file] = newFileList;
              if (file.response && file.response.url) {
                onChange(`${config.API_URL}${file.response.url}`);
              }
            }
          }
          setFileList(newFileList);
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ImageUpload;
