import { Box, Grid, Modal } from "@mui/material";
import PostDetails from "../pages/PostDetails";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%", //position
  left: "50%", //position
  transform: "translate(-50%, -50%)", //center
  width: "80%",
  maxWidth: 800,
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "12px",
  // overflow: "auto", // Enable scrolling
};

const ImagesGrid = ({ posts }) => {
  //make each image a open state
  const [openPostIndex, setOpenPostIndex] = useState(null);

  const handleOpen = (index) => {
    setOpenPostIndex(index);
  };

  const handleClose = () => {
    setOpenPostIndex(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {posts.map((post, index) => (
          <Grid item lg={4} md={3} xs={4} key={index}>
            <img
              onClick={() => handleOpen(index)}
              className="object-cover w-full h-full"
              src={post.images[0]}
              alt={`Image ${index}`}
              style={{
                aspectRatio: "1 / 1",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
            <Modal
              open={openPostIndex === index}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description">
              <Box sx={style}>
                <PostDetails the_post={post} />
              </Box>
            </Modal>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImagesGrid;
