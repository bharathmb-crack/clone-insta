import React, { useEffect, useState } from "react";
import {
  BookmarkIcon,
  ChatIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import {
  DotsHorizontalIcon,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firesbase";
import Moment from "react-moment";

const Post = ({ id, userName, userImage, image, caption }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);

  const { data: session } = useSession();
  console.log(session);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [db, id]
  );

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) == !-1
    );
  }, [likes]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="bg-white my-7 border rounded-md">
      {/* userimage and username and 3 dots */}
      <div className="flex items-center p-5">
        <img
          className="w-10 h-10 object-contain rounded-full border p-1 mr-3"
          src={userImage}
          alt=""
        />
        <p className="text-sm font-semibold flex-1 text-gray-700">{userName}</p>
        <DotsHorizontalIcon className="h-5 text-gray-700" />
      </div>

      <img className="w-full object-cover" src={image} alt="" />

      {session && (
        <div className="flex justify-between m-2">
          <div className="flex space-x-4 items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="btn text-red-500 cursor-pointer"
              />
            ) : (
              <HeartIcon onClick={likePost} className="btn cursor-pointer" />
            )}

            <ChatIcon className="btn cursor-pointer" />
            <PaperAirplaneIcon className="btn cursor-pointer" />
          </div>

          <BookmarkIcon className="btn" />
        </div>
      )}
      {likes.length > 0 && (
        <p className="font-semibold m-2">{likes.length} likes</p>
      )}

      <p className="m-2">
        <span className="font-semibold mr-3">{userName}</span>
        {caption}
      </p>

      {/* comments  */}
      {comments.length > 0 && (
        <div className="ml-8 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map((commt) => (
            <div className="flex items-center m-2 px-1 py-0.5">
              <img
                className="w-7 h-7 object-contain mx-2 rounded-full"
                src={`${commt.data().userImage}`}
                alt=""
              />
              <p className="text-sm font-semibold mr-2">
                {commt.data().username}
              </p>
              <p className="text-sm flex-1">{commt.data().comment}</p>
              <Moment fromNow>{commt.data().timestamp?.toDate()}</Moment>
            </div>
          ))}
        </div>
      )}

      {session && (
        <form className="flex items-center m-2  px-2 py-0.5">
          <EmojiHappyIcon className="h-7" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="add a comment..."
            className="border-none focus:ring-0 flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
            className="font-semibold text-blue-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
