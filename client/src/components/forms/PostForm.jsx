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
  const { currentUser } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setFormData({ ...formData, userId: currentUser._id });
      copyFilesFromImgAndPurls();
      imgFiles.map((imgFile) => {
        uploadImageFiles(imgFile);
      });

      // axios post
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImageFiles = async (imageFile) => {
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
          console.log(error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({
            ...formData,
            images: [...formData.images, downloadURL],
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
    if (e.target.id === "location" || e.target.id === "caption") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (e.target.id === "tags") {
      const tags = e.target.value.split(",");
      setFormData({ ...formData, tags });
    }
  };
  return (
    <form className="flex flex-col gap-9 w-full">
      {/*Caption */}
      <div className="flex flex-col gap-2">
        <label>Caption</label>
        <textarea
          id="caption"
          onChange={handleChange}
          className="border border-orange-500 p-3 rounded-lg h-[120px]"></textarea>
      </div>

      {/*Images */}
      <div className="flex flex-col gap-2">
        <label>Upload Images</label>
        {/*ImageWrapper */}
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
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          {/*images */}
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
      <button type="button" onClick={() => navigate(-1)}>
        Cancel
      </button>
      <button onClick={handleSubmit}>Create Post</button>
    </form>
  );
}
