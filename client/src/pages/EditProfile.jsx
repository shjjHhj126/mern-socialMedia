import React, { useRef, useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile({ currentUser }) {
  const [formData, setFormData] = useState({
    avatar: currentUser.avatar,
    coverPicture: currentUser.coverPicture,
    name: currentUser.name,
    bio: currentUser.bio,
    email: currentUser.email,
    from: currentUser.from,
    city: currentUser.city,
    password: currentUser.password,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [creating, setCreating] = useState(false);
  const avatarInput = useRef(null);
  const coverPicInput = useRef(null);
  // let toastId = null;
  let coverPicDownloadURL = null;
  let avatarDownloadURL = null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");
    if (formData.name === "") {
      setErrorMsg("Name cannot be empty.");
      setCreating(false);
      return;
    } else if (formData.email === "") {
      setErrorMsg("Email cannot be empty.");
      setCreating(false);
      return;
    } else if (formData.password === "") {
      setErrorMsg("Password cannot be empty.");
      setCreating(false);
      return;
    }

    try {
      // const initialToastId = toast.info(
      //   "Updating profile...(it may last for a few seconds).",
      //   {
      //     autoClose: false,
      //   }
      // );
      // toastId = initialToastId;

      await imageUpload();
      //also set downloadURLs, imageUpload is async, so should add await, this will NOT wait for setFormData()(if it is included in the imageUpload() body) to complete.

      const res = await axios.put(
        "api/user/update",
        {
          ...formData,
          avatar: avatarDownloadURL ? avatarDownloadURL : formData.avatar,
          coverPicture: coverPicDownloadURL
            ? coverPicDownloadURL
            : formData.coverPicture,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      setCreating(false);

      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        autoClose: 1000,
      });
    } catch (err) {
      setErrorMsg("");
      setCreating(false);
    }
  };

  const imageUpload = async () => {
    if (avatarFile) {
      avatarDownloadURL = await uploadImageFilePromise(avatarFile);
    }
    if (coverPicFile) {
      coverPicDownloadURL = await uploadImageFilePromise(coverPicFile);
    }
  };

  const uploadImageFilePromise = (imageFile) => {
    return new Promise((resolve, reject) => {
      try {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // Update progress if needed
          },
          (error) => {
            // Handle upload error
            console.error("Upload error:", error);
            reject(error);
          },
          () => {
            try {
              console.log("Success");
              const download = getDownloadURL(uploadTask.snapshot.ref);
              resolve(download);
            } catch (error) {
              reject(error);
            }
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        reject(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
      <input
        id="coverPicture"
        type="file"
        hidden
        accept="image/*"
        ref={coverPicInput}
        onChange={(e) => {
          setFormData({
            ...formData,
            coverPicture: URL.createObjectURL(e.target.files[0]),
          });
          setCoverPicFile(e.target.files[0]);
        }}
      />
      <img
        src={formData.coverPicture}
        onClick={() => coverPicInput.current.click()}
        className="h-[200px] md:h-[250px] lg:h-[300px] object-cover"></img>
      <div className="flex gap-8 items-center">
        <input
          ref={avatarInput}
          hidden
          id="avatar"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              avatar: URL.createObjectURL(e.target.files[0]),
            });
            setAvatarFile(e.target.files[0]);
          }}></input>
        <img
          className="h-[80px] w-[80px] object-cover rounded-full"
          src={formData.avatar}
        />
        <div className="flex flex-col gap-1">
          <p className="text-2xl">{formData.name}</p>
          <p
            onClick={() => avatarInput.current.click()}
            className="text-blue-500 font-semibold cursor-pointer">
            Change Profile Photo
          </p>
        </div>
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          Name
        </label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          Bio
        </label>
        <input
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          Email
        </label>
        <input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          From
        </label>
        <input
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          City
        </label>
        <input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex gap-8 items-center ">
        <label className="w-[80px] text-right font-bold text-normal ">
          Password
        </label>
        <input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="flex-1 outline-none p-3 border-[2px] border-gray-100 rounded-lg"
        />
      </div>
      <div className="flex justify-center">
        <button
          disabled={creating}
          className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 w-1/2 rounded-md hover:opacity-95 disabled:opacity-80">
          {creating ? "Updating..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
