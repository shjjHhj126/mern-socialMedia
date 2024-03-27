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

export default function PostForm() {
  const [formData, setFormData] = useState({
    userId: "",
    caption: "",
    images: null,
    location: "",
    tags: [],
  });
  const [imgAndPurls, setImgAndPurls] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [creating, setCreating] = useState(false);
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
    setCreating(true);
    if (formData.caption === "") {
      setErrorMsg("caption required!");
      setCreating(false);
      return;
    } else if (imgAndPurls.length === 0) {
      setErrorMsg("at least one image!");
      setCreating(false);
      return;
    } else if (imgAndPurls.length > 6) {
      setErrorMsg("at most 6 images!");
      setCreating(false);
      return;
    }

    try {
      const initialToastId = toast.info(
        "Creating post...(it may last for a few seconds).",
        {
          autoClose: false,
        }
      );
      toastId = initialToastId;

      copyFilesFromImgAndPurls();

      await handleImageUpload();

      await axios.post(
        "api/post/create",
        {
          ...formData,
          images: downloadURLs,
          userId: currentUser._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCreating(true);

      toast.update(toastId, {
        onClose: () => navigate("/"),
        render: "Images created successfully!",
        type: "success",
        autoClose: 1000,
      });
    } catch (err) {
      console.log(err);
      setErrorMsg("An error occurred during image upload.");
      setCreating(false);
    }
  };

  const handleImageUpload = async () => {
    for (const imgFile of imgFiles) {
      try {
        const downloadURL = await uploadImageFilePromise(imgFile);
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
      // console.log(imgAndPurl.file);
      return imgAndPurl.file;
    });
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
    <form className="flex flex-col flex- start gap-9 w-full">
      {/*Caption */}
      <div className="flex flex-col gap-2">
        <label>Caption</label>
        <textarea
          id="caption"
          required
          minLength={5} //at least enter 5 chars
          onChange={handleChange}
          value={formData.caption}
          className="border border-orange-500 p-3 rounded-lg h-[120px]"></textarea>
      </div>
      {/*Images */}
      <div className="flex flex-col gap-2">
        <label>Upload Images</label>
        {/*ImageDropzone */}
        <div className="flex flex-col gap-4">
          {/*drag and drop zone */}
          {/*fileInput.current.click() in <div> coresponding to fileInput in <input/> */}
          <div
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
            onClick={() => fileInput.current.click()}
            className="flex flex-col items-center justify-center border border-orange-500 border-w-2 w-full h-[100px] rounded-lg">
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
          {/*show images */}
          <div className="flex flex-wrap gap-2">
            {imgAndPurls.length > 0 &&
              imgAndPurls.map((imgAndPurl, index) => {
                // Perform optional chaining here
                const hasPreviewUrl = imgAndPurl.previewUrl;

                return (
                  hasPreviewUrl && (
                    <div key={index} className="flex">
                      <img
                        className="h-40 w-50 object-cover rounded-lg"
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
      </div>
      {/*Location */}
      <div className="flex flex-col gap-2 ">
        <label>Add Location</label>
        <input
          onChange={handleChange}
          id="location"
          type="text"
          value={formData.location}
          className="border border-orange-500 p-3 rounded-lg"></input>
      </div>
      {/*Add Tags*/}
      <div className="flex flex-col gap-2 ">
        <label>Add Tags (seperated by comma ",")</label>
        <input
          id="tags"
          type="text"
          onChange={handleChange}
          className="border border-orange-500 p-3 rounded-lg"></input>
      </div>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <ToastContainer />
      <div className="flex gap-2 right-0 ml-auto">
        <div className="flex gap-2 right-0 ml-auto"></div>
        <button
          className="transparent border border-solid border-orange-500 text-orange-500 p-2 rounded-lg hover:opacity-95"
          type="button"
          onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button
          disabled={errorMsg !== "" || creating === true}
          className="bg-orange-500 text-white p-2 rounded-lg hover:opacity-95 disabled:opacity-80"
          onClick={handleSubmit}>
          {creating === true ? "Creating..." : "Create Post"}
        </button>
      </div>
    </form>
  );
}
// ml-auto in bottom div for buttons : applying ml-auto to the <div> element makes it take up all the available space to its left, effectively pushing it to the right edge of the form container.
