import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import Cookies from "js-cookie";
import { useDropzone } from "react-dropzone";
import {
  getAllBlogCategories,
  getBlogCategoryByBlogId,
} from "../../../utils/BlogCategoryService";
import { saveBlog, updateBlogByBlogId } from "../../../utils/BlogService";

interface BlogFormProps {
  onSave: () => void;
  initialBlog?: any;
}

interface BlogCategoryProps {
  blogCategoryId: number;
  blogCategoryName: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSave, initialBlog }) => {
  const [blog, setBlog] = useState<any>({
    blogCategoryId: "",
    title: "",
    shortDescription: "",
    content: "",
    publishDate: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
  });
  const [blogCategories, setBlogCategories] = useState<BlogCategoryProps[]>([]);
  const [file, setFile] = useState<any | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllBlogCategories();
        setBlogCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBlogData = async () => {
      if (initialBlog) {
        try {
          const categoryResponse = await getBlogCategoryByBlogId(
            initialBlog.blogId
          );
          const publishDate = new Date(
            new Date(initialBlog.publishDate).getTime() + 7 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(0, 16);
          setBlog({
            ...initialBlog,
            blogCategoryId: categoryResponse.data.blogCategoryId || "",
            publishDate: publishDate,
          });
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      }
    };

    fetchCategories();
    fetchBlogData();
  }, [initialBlog]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setBlog((prevBlog: any) => ({
      ...prevBlog,
      [name]: value || "",
    }));
  };

  const handleEditorChange = (content: any) => {
    setBlog((prevBlog: any) => ({
      ...prevBlog,
      content: content,
    }));
  };

  const onDrop = (acceptedFiles: any) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = Cookies.get("authToken") as string;
    const blogCategoryId = blogCategories.find(
      (blogCategory) => blogCategory.blogCategoryId === blog.blogCategoryId
    )?.blogCategoryId as number;

    const formData = new FormData();
    const formData2 = new FormData();
    formData.append("title", blog.title);
    formData.append("shortDescription", blog.shortDescription);
    formData.append("content", blog.content);
    formData.append("publishDate", blog.publishDate);
    formData.append("file", file);

    if (file) {
      formData2.append("title", blog.title);
      formData2.append("shortDescription", blog.shortDescription);
      formData2.append("content", blog.content);
      console.log(blog.content);
      formData2.append("publishDate", blog.publishDate);
      formData2.append("file", file);
      formData2.append("imageUrl", blog.imageUrl);
    } else if (initialBlog) {
      formData2.append("title", blog.title);
      formData2.append("shortDescription", blog.shortDescription);
      formData2.append("content", blog.content);
      console.log(blog.content);
      formData2.append("publishDate", blog.publishDate);
      formData2.append("imageUrl", blog.imageUrl);
    }

    try {
      if (initialBlog) {
        await updateBlogByBlogId(
          token as string,
          formData2,
          initialBlog.blogId,
          blogCategoryId as number
        );
      } else {
        await saveBlog(token, formData, blogCategoryId);
      }
      onSave();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Tiêu đề"
            variant="outlined"
            fullWidth
            value={blog.title || ""}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={3}>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "18px",
            }}
          >
            Ảnh bìa bài viết:
          </div>
        </Grid>
        <Grid item xs={9}>
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
          {file && <p>Đã chọn tệp: {file.name}</p>}
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="blogCategoryId"
              value={blog.blogCategoryId || ""}
              onChange={handleChange}
              label="Danh mục"
              required
            >
              {blogCategories.map((blogCategory) => (
                <MenuItem
                  key={blogCategory.blogCategoryId}
                  value={blogCategory.blogCategoryId}
                >
                  {blogCategory.blogCategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="shortDescription"
            label="Miêu tả sơ lược"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={blog.shortDescription || ""}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Editor
            apiKey="ulxmohd7vjbrnhgat12h8yffnqdp4qh2q5xcns8iqs1zdv27"
            init={{
              height: 500,
              menubar: false,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            value={blog.content || ""}
            onEditorChange={handleEditorChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="publishDate"
            label="Ngày đăng"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={blog.publishDate || ""}
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {initialBlog ? "Cập Nhật" : "Thêm"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default BlogForm;
