import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
export const UpdatePost = () => {
  const [file, setFiles] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
    const currentUser=useSelector(state=>state.user.currentUser);
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
        }
        if (res.ok) {
            setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

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

  const formHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (err) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Upload a post</h1>
      <form className="flex flex-col gap-4" onSubmit={formHandle}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
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
              "Upload image"
            )}
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
          value={formData.content} 
          placeholder="Write your blog here...."
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};
