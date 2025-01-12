import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "bootstrap";

const BusinessSizes = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");

  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [newBusinessSize, setNewBusinessSize] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  const customRowsPerPageOptions = [5, 10, 20];
const [modalInstance, setModalInstance] = useState(null);
const authCloseModal = (elementId) => {
  const myModal = new Modal(document.getElementById(elementId));

  myModal.show();

  myModal._element.addEventListener("shown.bs.modal", () => {
    clearTimeout(myModal._element.hideInterval);
    const id = setTimeout(() => {
      myModal.hide();
    });
    myModal._element.hideInterval = id;

    const backdropElement = document.querySelector(".modal-backdrop.show");
    if (backdropElement) {
      backdropElement.remove();
    }
  });

  setModalInstance(myModal);
};

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => filteredItems.indexOf(row) + 1,
      sortable: true,
      grow: 0,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Business Sizes",
      selector: (row) => row.businessSizeName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Action",
      sortable: false,
      center: true,
      grow: 0,

      cell: (row) => (
        <button
          data-bs-toggle="modal"
          data-bs-target="#editBusinessSize"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };
  const handleEdit = (item) => {
    setEditRow(item);
    setItemId(item.id);
  };


  const handleChange = (event) => {
    setNewBusinessSize(event.target.value);
  };

  const addNewBusinessSize = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/business-sizes`,
        {
          businessSizeName: newBusinessSize,
          DateCreated: new Date().toISOString(),
          CreatedBy: userData[0]?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPending(false);
        if (response.status === 200) {
          setLoading(false);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setNewBusinessSize("");
          setTimeout(() => {
            authCloseModal("addBusinessSize");
            window.location.reload();
          }, 2000);
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            });
          }
        } else
          toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
      });
  };
  const editBusinessSize = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/business-sizes/${itemId}`,
        {
          businessSizeName: editRow.businessSizeName,
          DateModified: new Date().toISOString(),
          ModifiedBy: userData[0].email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setNewBusinessSize("");
          setTimeout(() => {
            authCloseModal("editBusinessSize");
            window.location.reload();
          }, 2000);
        }
        setLoading(false);
        // return true;
      })
      .catch((error) => {
     
        setLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            });
          }
        } else
          toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
      });
  };

  const filteredItems = data.filter(
    (item) =>
      item.businessSizeName &&
      item.businessSizeName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <div className="flex justify-content-between ">
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
            placeholder="Search By Business Size"
          />
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            });
          }
        } else
          toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
      });
  }, [token, data]);

  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Business Sizes</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Business Sizes </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addBusinessSize"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Business Size
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="">
              <div className="">
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  pagination
                  progressPending={pending}
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addBusinessSize">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Business Size</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={addNewBusinessSize}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Business Size
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newBusinessSize}
                              placeholder="Enter Business Size"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
                        >
                          {loading ? <Spinner /> : "Add"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="editBusinessSize">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Business Size</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={editBusinessSize}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Business Size
                            </label>

                            <input
                              type="text"
                              name="businessSizeName"
                              className="form-control"
                              value={editRow ? editRow.businessSizeName : ""}
                              placeholder="Enter Business Size "
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
                        >
                          {loading ? <Spinner /> : "Edit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style={{ marginTop: "20px" }}
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    </>
  );
};

export default BusinessSizes;
