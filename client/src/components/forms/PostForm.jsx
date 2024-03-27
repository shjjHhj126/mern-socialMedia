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
import { resolve } from "any-promise";

export default function PostForm() {
  const [formData, setFormData] = useState({
    userId: "",
    caption: "",
    images: [],
    location: "",
    tags: [],
  });
  const [imgAndPurls, setImgAndPurls] = useState([]);
  const [imgFiles, setImgFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (formData.caption === "") {
      setErrorMsg("caption required!");
      return;
    } else if (imgAndPurls.length == 0) {
      setErrorMsg("at least one image!");
      return;
    } else if (imgAndPurls.length > 6) {
      setErrorMsg("at most 6 images!");
      return;
    }

    try {
      setFormData({ ...formData, userId: currentUser._id });
      copyFilesFromImgAndPurls();

      handleImageSubmit();

      // axios post

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleImageSubmit = () => {
    const promises = [];
    for (let i = 0; i < imgFiles.length; i++) {
      promises.push(uploadImageFile(imgFiles[i]));
    }

    Promise.all([promises])
      .then((urls) => {
        setFormData({ ...formData, images: formData.images.concat(urls) });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImageFile = async (imageFile) => {
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
          reject(error);
        },
        () => {
          // Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const copyFilesFromImgAndPurls = () => {
    setImgFiles((previmgFiles) => {
      return imgAndPurls.map((imgAndPurl) => {
        // console.log(imgAndPurl.file);
        return imgAndPurl.file;
      });
    });
    // console.log("hi");
    // console.log(imgFiles);
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
      <div className="flex gap-2 right-0 ml-auto">
        <button
          className="transparent border border-solid border-orange-500 text-orange-500 p-2 rounded-lg hover:opacity-95"
          type="button"
          onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button
          disabled={errorMsg !== ""}
          className="bg-orange-500 text-white p-2 rounded-lg hover:opacity-95 disabled:opacity-80"
          onClick={handleSubmit}>
          Create Post
        </button>
      </div>
    </form>
  );
}
// ml-auto in bottom div for buttons : applying ml-auto to the <div> element makes it take up all the available space to its left, effectively pushing it to the right edge of the form container.
