import { useState, useRef } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { RxCrossCircled } from "react-icons/rx";
import { IoMdImages } from "react-icons/io";

export default function PostForm() {
  const fileInput = useRef(null);
  const [formData, setFormData] = useState({
    images: [],
    caption: "",
    location: "",
    tags: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileUpload = (e) => {
    acceptedFiles.map((file) => {
      const fileName = new Date().getTime() + file.name;
      uploadFile(file, fileName);
      return fileName;
    });
  };

  const uploadFile = async (file, fileName) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
          setFileMapping({ ...fileMapping, fileName: downloadURL });
        }
      );
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleFiles = (files) => {
    //The Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.
    const fileURLs = Array.from(files).map((file) => URL.createObjectURL(file));

    // Concatenate the new file URLs with the existing previewUrls array
    setPreviewUrls((prevUrls) => [...prevUrls, ...fileURLs]);
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };
  const handleOnDrop = (event) => {
    event.preventDefault(); //prevent the browser from opening the image
    event.stopPropagation(); // stop the event (in this case, a drop event) from bubbling up the DOM tree.

    let imageFiles = event.dataTransfer.files;
    handleFiles(imageFiles);
  };

  const handleDeleteImage = (URL) => {
    setPreviewUrls((prevUrls) => {
      return prevUrls.filter((url) => url !== URL);
    });
  }; //prevUrls get the previous state, async stuff

  return (
    <form className="flex flex-col gap-9 w-full">
      {/*Caption */}
      <div className="flex flex-col gap-2">
        <label>Caption</label>
        <textarea className="border border-orange-500 p-2 rounded-lg"></textarea>
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
            {previewUrls.length > 0 &&
              previewUrls.map((url, index) => (
                <div key={index} className="flex">
                  <img
                    className="h-40 w-50 object-cover rounded-lg"
                    src={url}
                    alt="image"
                  />
                  <button
                    type="button" //ahhhhhhh!
                    className="-ml-5 -mt-[15px] h-8"
                    onMouseUp={() => handleDeleteImage(url)}>
                    <RxCrossCircled className="bg-white text-orange-500 rounded-full text-3xl" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/*Location */}
      <div>
        <label>Add Location</label>
        <input id="location" type="text"></input>
      </div>

      {/*Add Tags*/}
      <div>
        <label>Add Tags (seperated by comma ",")</label>
        <input id="tags" type="text"></input>
      </div>
      {/* <button type="button" onClick={handleFileUpload}>
        Upload image
      </button> */}
    </form>
  );
}
