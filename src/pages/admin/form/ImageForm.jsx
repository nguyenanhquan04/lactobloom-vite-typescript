import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  DialogActions,
} from "@mui/material";

import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import { deleteImageByImageId, getImagesByProductId, saveImageByProductId } from "../../../utils/ImageService";

const ImageForm = ({ open, onClose, product, onSave }) => {
  const [productImages, setProductImages] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await getImagesByProductId(product.productId);
        setProductImages(response.data);
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    if (product?.productId) {
      fetchProductImages();
    }
  }, [product]);

  const fetchProductImages = async () => {
    try {
      const response = await getImagesByProductId(product.productId);
      setProductImages(response.data);
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  const handleDeleteImage = async () => {
    const token = Cookies.get("authToken");
    try {
      const imageId = productImages[deleteIndex].imageId;
      await deleteImageByImageId(token, imageId);
      onSave(); // Call onSave to refresh the product list in the parent component
      fetchProductImages(); // Refetch the images
      setDeleteIndex(null); // Reset the delete index
    } catch (error) {
      console.error("Error deleting product image:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("files", file);

      const token = Cookies.get("authToken");
      setUploading(true);

      try {
        await saveImageByProductId(token, formData, product.productId);
        onSave(); // Call onSave to refresh the product list in the parent component
        fetchProductImages(); // Refetch the images
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    },
    [product, onSave]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Cập nhật ảnh sản phẩm</DialogTitle>
      <DialogContent>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Thả tệp vào đây...</p>
          ) : (
            <p>Kéo và thả tệp vào đây hoặc nhấp để chọn tệp</p>
          )}
        </div>
        {uploading && <p>Uploading...</p>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Xem trước</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productImages.map((img, index) => (
                <TableRow key={img.imageId}>
                  <TableCell>
                    <img
                      src={img.imageUrl}
                      alt="Product"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => setDeleteIndex(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Image"}</DialogTitle>
        <DialogContent>
          Bạn có muốn xóa ảnh?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteImage} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ImageForm;
