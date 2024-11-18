import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export const CreatePost = () => {
  const [file, setFiles] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [formData, setFormData] = useState({});
  const handleUploadImage = async () => {
    setImageFileUploading(true);
    try {
      if (!file) {
        setImageUploadError("Please select a image");
        return;
      }
      setImageUploadError(null);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "dasdas");
      data.append("cloud_name", "dogtbqqmy");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dogtbqqmy/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const files = await res.json();
      setFormData({ ...formData, image: files.url });
      setImageFileUploading(null);
      setImageUploadError(null);
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageFileUploading(null);
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="unCategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">Reacct.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="md"
            outline
            onClick={handleUploadImage}
          >
            {imageFileUploading ? (
             <div className="w-16 h-16">
               <CircularProgressbar
                value={imageFileUploading}
                text={`${imageFileUploading}%`}
              />
             </div>
            ) : (
              'Upload image'
            )
            }
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write your blog here...."
          className="h-72 mb-12"
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};
