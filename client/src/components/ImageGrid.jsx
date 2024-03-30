import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({}));

const ImagesGrid = ({ posts }) => {
  const images = posts.map((post) => post.images[0]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {images.map((url, index) => (
          <Grid item lg={4} md={3} xs={4} key={index}>
            <Item>
              <img
                className="object-cover w-full h-full"
                src={url}
                alt={`Image ${index}`}
                style={{
                  aspectRatio: "1 / 1",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImagesGrid;
