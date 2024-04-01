import { useState, useRef } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import { IoMdImages } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostForm({ actionType, post }) {
  const [formData, setFormData] = useState({
    caption: post ? post.caption : "",
    location: post ? post.location : "",
    tags: post ? post.tags.join(",") : [],
  });
  const [imgAndPurls, setImgAndPurls] = useState(
    post
      ? post.images.map((url) => ({
          previewUrl: url,
        }))
      : []
  ); //[{previewUrl:url}, {previewUrl:url}, {previewUrl:url}, ...]
  const [errorMsg, setErrorMsg] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const navigate = useNavigate();
  let imgFiles = [];
  let downloadURLs = [];
  let toastId = null;
  // do not use setter created by hook, they are sync, but is scheduled to executed(so will not executed immediately)
  // state in react ony used to re-render, imgFiles is not responsible to re-render, so use let

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmiting(true);
    if (formData.caption === "") {
      setErrorMsg("caption required!");
      setSubmiting(false);
      return;
    } else if (imgAndPurls.length === 0) {
      setErrorMsg("at least one image!");
      setSubmiting(false);
      return;
    } else if (imgAndPurls.length > 6) {
      setErrorMsg("at most 6 images!");
      setSubmiting(false);
      return;
    }

    try {
      const initialToastId = toast.info(
        actionType === "create"
          ? "Creating post...(it may last for a few seconds)."
          : "Updating post...(it may last for a few seconds).",
        {
          autoClose: false,
        }
      );
      toastId = initialToastId;

      copyFilesFromImgAndPurls();

      await handleImageUpload();

      actionType === "create"
        ? await axios.post(
            "api/post/create",
            {
              ...formData,
              images: downloadURLs,
              creator: currentUser._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        : await axios.put(
            `api/post/update/${post._id}`,
            {
              ...formData,
              images: downloadURLs,
              creator: currentUser._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      setSubmiting(false);

      toast.update(toastId, {
        onClose: () => navigate("/"),
        render:
          actionType === "create"
            ? "Post created successfully!"
            : "Post updated successfully!",
        type: "success",
        autoClose: 1000,
      });
      // handleCloseModal();
    } catch (err) {
      console.log(err);
      setErrorMsg("An error occurred during post upload.");
      setSubmiting(false);
      // handleCloseModal();
    }
  };

  const handleImageUpload = async () => {
    for (const imgFile of imgFiles) {
      try {
        let downloadURL = null;
        if (typeof imgFile === "string") {
          //EditPost already has downloadURL
          downloadURL = imgFile;
        } else {
          downloadURL = await uploadImageFilePromise(imgFile);
        }
        downloadURLs.push(downloadURL);
        // console.log("downloadURL", downloadURL);
      } catch (error) {
        console.error("Image upload error:", error);
      }
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
              const downloadURL = getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
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

  const copyFilesFromImgAndPurls = () => {
    imgFiles = imgAndPurls.map((imgAndPurl) => {
      if (imgAndPurl.file) return imgAndPurl.file;
      else return imgAndPurl.previewUrl;
    });
    //imgFiles has file OR previewUrl
  };

  const handleFiles = (files) => {
    setErrorMsg("");
    //The Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.
    const filesWithUrls = Array.from(files).map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return { file, previewUrl };
    }); //{file:file, previewUrl:previewUrl}
    // Concatenate the new file URLs with the existing previewUrls array
    setImgAndPurls((prevImgAndPurls) => [...prevImgAndPurls, ...filesWithUrls]);
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };
  const handleOnDrop = (event) => {
    event.preventDefault(); //prevent the browser from opening the image
    event.stopPropagation(); // stop the event (in this case, a drop event) from bubbling up the DOM tree.

    let files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleDeleteImage = (img_url) => {
    setImgAndPurls((prevImgAndPurls) => {
      return prevImgAndPurls.filter(
        (imgAndPurl) => imgAndPurl.previewUrl !== img_url.previewUrl
      );
    });
  }; //prevUrls get the previous state, async stuff

  const handleChange = (e) => {
    setErrorMsg("");
    if (e.target.id === "location" || e.target.id === "caption") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (e.target.id === "tags") {
      const tags = e.target.value.split(",");
      setFormData({ ...formData, tags });
    }
  };

  return (
    <div className="flex flex-col md:flex-row border-dashed border-[1px] border-orange-500 h-full rounded-lg">
      {/*Leftpart : show images */}
      <div className="flex-1 flex-wrap gap-2  md:w-1/2 min-h-[200px] w-full overflow-scroll custom-scrollbar rounded-tl-lg rounded-tr-lg md:rounded-bl-lg md:rounded-tr-none bg-white">
        {/*Leftpart : wrapper */}
        <div className="flex flex-wrap">
          {imgAndPurls.length > 0 &&
            imgAndPurls.map((imgAndPurl, index) => {
              // Perform optional chaining here
              const hasPreviewUrl = imgAndPurl.previewUrl;

              return (
                hasPreviewUrl && (
                  <div key={index} className="flex p-3 w-[180px] md:w-[210px]">
                    <img
                      className="h-[180px] w-[180px] md:w-[210px] object-cover rounded-lg"
                      src={imgAndPurl.previewUrl} // Use imageFile.previewUrl instead of 'url'
                      alt="image"
                    />
                    <button
                      type="button"
                      className="-ml-5 -mt-[15px] h-8"
                      onMouseUp={() => handleDeleteImage(imgAndPurl)} // Pass imageFile instead of 'url' to handleDeleteImage
                    >
                      <RxCrossCircled className="bg-white text-orange-500 rounded-full text-3xl" />
                    </button>
                  </div>
                )
              );
            })}
        </div>
      </div>

      {/*Rightpart : input areas */}
      <form className=" flex-1 flex flex-col flex-start md:w-1/2 w-full h-full relative bg-white md:rounded-br-lg md:rounded-tr-lg md:rounded-bl-none rounded-b-lg">
        {/*Caption */}
        <div className="flex flex-col gap-2">
          <textarea
            id="caption"
            required
            minLength={5} //at least enter 5 chars
            onChange={handleChange}
            value={formData.caption}
            placeholder="Write a caption..."
            className="border border-b-1 border-w-2 p-3 h-[120px] lg:rounded-tr-lg outline-none"></textarea>
        </div>

        {/*Images */}
        {/*fileInput.current.click() in <div> coresponding to fileInput in <input/> */}
        <div
          onDragOver={handleOnDragOver}
          onDrop={handleOnDrop}
          onClick={() => fileInput.current.click()}
          className="flex flex-col items-center justify-center border border-gray-300 border-w-2 w-full h-[100px]">
          <IoMdImages className="text-3xl text-gray-400" />
          <p className="text-gray-400">
            Click to select or Drag and drop image here....
          </p>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            hidden
            multiple
            required
            minLength={1}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/*Location */}
        <input
          onChange={handleChange}
          id="location"
          type="text"
          placeholder="Add Location..."
          value={formData.location}
          className="border border-gray-300 border-w-2 p-3 w-full outline-none"></input>
        {/*Add Tags*/}
        <input
          id="tags"
          type="text"
          onChange={handleChange}
          placeholder="Add Tags (seperated by comma ',')..."
          className="border border-gray-300 border-w-2 p-3 w-full outline-none"></input>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <ToastContainer />

        {/*buttons */}
        {/*flex-1 and h-full make sure the outer div take the remaining space,flex-col specifys the direction */}
        <div className="flex-1 border-l-[1px] border-gray-300 h-full flex flex-col justify-end">
          {/*inner div make sure the buttons are flex-row */}
          <div className=" flex m-5">
            {actionType === "create" && (
              <button
                className="transparent border border-solid rounded-s-md border-orange-500 text-orange-500 p-2 w-1/2 hover:opacity-95"
                type="button"
                onClick={() => navigate(-1)}>
                Cancel
              </button>
            )}
            <button
              disabled={errorMsg !== "" || submiting === true}
              className={`bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 ${
                actionType === "create"
                  ? "w-1/2 rounded-e-md"
                  : "w-full rounded-md"
              }  hover:opacity-95 disabled:opacity-80`}
              onClick={handleSubmit}>
              {actionType === "create" &&
                (submiting === true ? "Creating..." : "Create Post")}
              {actionType === "update" &&
                (submiting === true ? "Updating..." : "Update Post")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
// ml-auto in bottom div for buttons : applying ml-auto to the <div> element makes it take up all the available space to its left, effectively pushing it to the right edge of the form container.
