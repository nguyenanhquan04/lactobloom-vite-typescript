import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import VoucherForm from "./form/VoucherForm"; // Import the VoucherForm component
import { deleteVoucherByVoucherId, getAllVouchers } from "../../utils/VoucherService";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [editVoucher, setEditVoucher] = useState(null);
  const [open, setOpen] = useState(false); // State to handle dialog open/close

  useEffect(() => {
    const fetchVouchers = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await getAllVouchers(token);
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (voucherId) => {
    const token = Cookies.get("authToken");
    if (window.confirm("Bạn có chắc muốn xóa voucher này?")) {
      try {
        await deleteVoucherByVoucherId(token, voucherId);
        setVouchers(
          vouchers.filter((voucher) => voucher.voucherId !== voucherId)
        );
      } catch (error) {
        console.error("Error deleting voucher:", error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAvailabilityChange = (event) => {
    setSelectedAvailability(event.target.value);
    setPage(0);
  };

  const handleEditVoucher = (voucher) => {
    setEditVoucher(voucher);
    setOpen(true);
  };

  const handleAddVoucher = () => {
    setEditVoucher(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditVoucher(null);
  };

  const handleSave = () => {
    // Fetch updated vouchers after saving
    const fetchVouchers = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await getAllVouchers(token);
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
    handleClose();
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.point.toString().includes(searchValue)
  );

  const displayedVouchers =
    selectedAvailability === "all"
      ? filteredVouchers
      : filteredVouchers.filter(
          (voucher) => voucher.available.toString() === selectedAvailability
        );

  const paginatedVouchers = displayedVouchers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="voucher-management-container">
      <h1>Quản lý Voucher</h1>
      <Grid
        container
        spacing={0}
        alignItems="center"
        className="voucher-management-controls"
      >
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm Voucher"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="voucher-management-add-button"
            onClick={handleAddVoucher}
          >
            Thêm Voucher
          </Button>
        </Grid>
      </Grid>
      <FormControl
        variant="outlined"
        fullWidth
        className="voucher-management-availability-select"
      >
        <InputLabel>Khả dụng</InputLabel>
        <Select
          value={selectedAvailability}
          onChange={handleAvailabilityChange}
          label="Khả dụng"
        >
          <MenuItem value="all">Tất cả Voucher</MenuItem>
          <MenuItem value="true">Khả dụng</MenuItem>
          <MenuItem value="false">Không khả dụng</MenuItem>
        </Select>
      </FormControl>
      <TableContainer
        component={Paper}
        className="voucher-management-table-container"
      >
        <Table className="voucher-management-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Điểm</TableCell>
              <TableCell>Giảm giá (%)</TableCell>
              <TableCell>Ngày hết hạn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chủ sở hữu</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVouchers.map((voucher) => (
              <TableRow key={voucher.voucherId}>
                <TableCell>{voucher.voucherId}</TableCell>
                <TableCell>{voucher.point}</TableCell>
                <TableCell>{voucher.discount}</TableCell>
                <TableCell>{voucher.expirationDate}</TableCell>
                <TableCell>
                  {voucher.available ? "Khả dụng" : "Không khả dụng"}
                </TableCell>
                <TableCell>{voucher.owner ?? "Không"}</TableCell>
                <TableCell className="voucher-management-actions">
                <IconButton onClick={() => handleDelete(voucher.voucherId)}>
                    <DeleteIcon />
                  </IconButton>
                  {voucher.owner ? null : (
                    <IconButton onClick={() => handleEditVoucher(voucher)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={displayedVouchers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="voucher-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editVoucher ? "Cập nhật Voucher" : "Thêm Voucher"}
        </DialogTitle>
        <DialogContent>
          <VoucherForm onSave={handleSave} initialVoucher={editVoucher} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoucherManagement;
