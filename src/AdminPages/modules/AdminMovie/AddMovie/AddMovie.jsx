import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import style from "./styleAddMovie.module.scss";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { addMovie, getMovieList } from "../../../../apis/movies";

const addMovieSchema = object({
  tenPhim: string().required("Tên phim không được để trống"),
  biDanh: string().required("Bí danh không được để trống"),
  moTa: string().required("Mô tả không được để trống"),
  hinhAnh: string().required("Hình ảnh không được để trống"),
  trailer: string().required("Trailer không được để trống"),
  ngayKhoiChieu: string().required("Ngày khởi chiếu không được để trống"),
});

export default function AddMovie({ handleCloseAddMovie }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tenPhim: "",
      biDanh: "",
      moTa: "",
      hinhAnh: "",
      trailer: "",
      ngayKhoiChieu: "",
    },
    resolver: yupResolver(addMovieSchema),
    mode: "onTouched",
  });

  const hinhAnh = watch("hinhAnh");
  const [imgPreview, setImgPreView] = useState("");
  useEffect(() => {
    const file = hinhAnh?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (evt) => {
      setImgPreView(evt.target.result);
    };
  }, [hinhAnh]);

  const { mutate: onSubmit } = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim);
      formData.append("biDanh", values.biDanh);
      formData.append("moTa", values.moTa);
      formData.append("hinhAnh", hinhAnh[0]);
      formData.append("trailer", values.trailer);
      formData.append("ngayKhoiChieu", values.ngayKhoiChieu);
      formData.append("maNhom", "GP08");

      return addMovie(formData);
    },
    onSuccess: () => {
      Swal.fire("Thành Công!", "Đã thêm phim mới", "success").then(function () {
        window.location.reload();
      });
      handleCloseAddMovie();
    },
  });

  return (
    <div className={style.jss1}>
      <h2 className={style.jss2}>THÊM PHIM MỚI</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.jss3} style={{ display: "flex" }}>
          <TextField
            error={errors.tenPhim}
            className={style.jss4}
            label="Tên Phim"
            variant="standard"
            {...register("tenPhim")}
            helperText={errors.tenPhim?.message}
          />

          <TextField
            error={errors.biDanh}
            className={style.jss4}
            label="Bí Danh"
            variant="standard"
            {...register("biDanh")}
            helperText={errors.biDanh?.message}
          />
        </div>
        <div>
          <TextField
            error={errors.moTa}
            className={style.jss4}
            label="Mô Tả"
            variant="standard"
            {...register("moTa")}
            helperText={errors.moTa?.message}
          />
        </div>
        <div style={{ display: "flex" }}>
          <TextField
            error={errors.hinhAnh}
            InputLabelProps={{
              shrink: true,
            }}
            className={style.jss4}
            label="Hình Ảnh"
            variant="standard"
            type="file"
            {...register("hinhAnh")}
            helperText={errors.hinhAnh?.message}
          />
          {imgPreview && (
            <div>
              <img src={imgPreview} alt="preview" width={200} height={200} />
            </div>
          )}
        </div>
        <div>
          <TextField
            error={errors.trailer}
            className={style.jss4}
            label="Trailer"
            variant="standard"
            {...register("trailer")}
            helperText={errors.trailer?.message}
          />
        </div>
        <div>
          <TextField
            error={errors.ngayKhoiChieu}
            InputLabelProps={{
              shrink: true,
            }}
            className={style.jss4}
            label="Ngày Khởi Chiếu"
            variant="standard"
            type="date"
            {...register("ngayKhoiChieu", {
              setValueAs: (value) => {
                return dayjs(value).format("DD/MM/YYYY");
              },
            })}
            helperText={errors.ngayKhoiChieu?.message}
          />
        </div>
        <div style={{ textAlign: "right", margin: "10px 0" }}>
          <button type="submit" className={style.jss5}>
            Thêm Phim
          </button>
          <button className={style.jss6} onClick={handleCloseAddMovie}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
