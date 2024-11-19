import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
export const Comments = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  console.log(comment.userId);
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="">
        <div className="">
          <span>{user ? `@${user.username}` : `anonymous user`}</span>
          <span>{moment(comment?.createdAt).fromNow()}</span>
        </div>
        <p className="text-gray-500 pb-2">{comment?.content}</p>
        <div>
          <button
            type="button"
            onClick={() => onLike(comment?._id)}
            className={`text-gray-500 hover:text-blue-600 ${
              currentUser &&
              comment?.likes.includes(currentUser._id) &&
              "text-blue-600"
            }`}
          >
            <FaThumbsUp className="text-sm" /> {comment?.likes.length}
          </button>
          <p className="text-gray-500">
            {comment?.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};
