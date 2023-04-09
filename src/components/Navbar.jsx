import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Navbar(props) {
  const url = props.url;

  const [userName, setUserName] = useState("");

  const [cartLength, setCartLength] = useState(0);

  const [admin, setAdmin] = useState(false);

  function getCartLength() {
    if (localStorage.cart) {
      setCartLength(JSON.parse(localStorage.cart).length);
    }
  }

  useEffect(() => {
    getCartLength();
    if (localStorage.admin) {
      setAdmin(JSON.parse(localStorage.admin));
    }
    if (localStorage.userData) {
      setUserName(
        JSON.parse(localStorage.userData).first_name +
          " " +
          JSON.parse(localStorage.userData).last_name
      );
    }
  }, []);

  async function addProduct(evt) {
    evt.preventDefault();
    const { name, description, price, image } = evt.target;
    const productBody = {
      name: name.value,
      description: description.value,
      price: price.value,
      image: image.value,
    };

    if (!name.value || !description.value || !price.value || !image.value) {
      return;
    }

    try {
      const result = await fetch(`${url}/products`, {
        method: "POST",
        body: JSON.stringify(productBody),
      });

      const jsonResult = await result.json();
      props.onAdd();
      name.value = "";
      description.value = "";
      price.value = "";
      image.value = "";
      toast.success(jsonResult?.message);
    } catch (e) {
      console.log(e);
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand navStyle" href="/shopping">
            Online Store
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {!admin && (
                <li className="nav-item">
                  <a
                    className="nav-link navStyle mb-0"
                    aria-current="page"
                    href="/cart"
                  >
                    (<span id="cartLength">{cartLength}</span>) Cart
                  </a>
                </li>
              )}
              {!admin && (
                <li className="nav-item">
                  <a className="nav-link navStyle mb-0" href="/favourites">
                    Favourites
                  </a>
                </li>
              )}
              {admin && (
                <li className="nav-item">
                  <p
                    className="nav-link navStyle mb-0"
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#addProductBtn"
                  >
                    Add Product
                  </p>
                </li>
              )}
              <li className="nav-item dropdown">
                <p
                  className="nav-link dropdown-toggle navStyle mb-0"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-user"></i>
                </p>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item">{userName}</li>
                  {/* <li className="dropdown-item"><a href="/orders">{admin ? "Orders" : "My Orders"}</a></li> */}

                  <li className="dropdown-item">
                    <button
                      type="button"
                      onClick={logout}
                      className="btn btn-info"
                      name="button"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="modal fade"
        id="addProductBtn"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ padding: "15px" }}>
            <div className="modal-header">
              <h1 className="modal-title navStyle fs-5" id="exampleModalLabel">
                Add Product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(evt) => addProduct(evt)} method="post">
                <input
                  type="text"
                  name="name"
                  placeholder=" Name"
                  autoComplete="off"
                  className="form-control mb-3"
                />
                <textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  className="form-control mb-3"
                />
                <input
                  type="number"
                  name="price"
                  placeholder=" Price"
                  className="form-control mb-3 me-2"
                />
                <input
                  type="text"
                  name="image"
                  placeholder=" Image(url)"
                  className="form-control mb-3"
                />
                <button
                  type="submit"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                >
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
