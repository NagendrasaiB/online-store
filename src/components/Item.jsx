import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Item(props) {
  const url = props.url;

  const [admin, setAdmin] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userData")).user_id;

  useEffect(() => {
    if (localStorage.admin) {
      setAdmin(JSON.parse(localStorage.admin));
    }
  }, []);

  function editProductInfo() {
    document.getElementById("editName").value = props.title;
    document.getElementById("editDescription").value = props.description;
    document.getElementById("editImage").value = props.image;
    document.getElementById("editPrice").value = props.price;
    document.getElementById("pro_id").value = props.product_id;
  }

  async function editProduct(evt) {
    evt.preventDefault();
    const { name, description, price, image, pro_id } = evt.target;
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
      const result = await fetch(`${url}/products/${pro_id.value}`, {
        method: "PUT",
        body: JSON.stringify(productBody),
      });

      const jsonResult = await result.json();
      props.onChange();
      toast.success(jsonResult?.message);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteProduct(id) {
    try {
      const result = await fetch(`${url}/products/${id}`, {
        method: "DELETE",
      });

      const jsonResult = await result.json();
      props.onChange();
      toast.success(jsonResult?.message);
    } catch (e) {
      console.log(e);
    }
  }

  function removeFromCart() {
    let cartItems = JSON.parse(localStorage.cart);
    cartItems = cartItems.filter((cartItem) => {
      return cartItem.product_id !== props.product_id;
    });
    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.error("Removed From Cart!");

    let a = document.getElementById("cartLength");
    a.innerText = Number(a.innerText) - 1;

    props.onDelete();
  }

  // function buy() {
  //   let buyData = `<div class="vstack">
  //     <h1 class="navStyle">Just one more Step!</h1>
  //     <p><strong>Product: </strong>${props.title}</p>
  //     <p><strong>Price: </strong>${props.price}/-</p>
  //     <p><strong>Delivery Charges: </strong>
  //         ${props.price < 500 ? '50/-' : 'Not applicable'}
  //     </p>
  //     <p><strong>Total: </strong>
  //       ${props.price < 500 ? props.price + 50  : props.price}/-
  //     </p>
  //   </div>`;

  //   document.getElementById('buyHeader').innerHTML = buyData;
  // }

  const [likeId, setLikeId] = useState(props.like);
  const [likeColor, setLikeColor] = useState(likeId === null ? "grey" : "red");

  async function like(e) {
    try {
      const result = await fetch(
        `${url}/favourites/${userId}/${e.target.parentElement.id}`,
        {
          method: "POST",
        }
      );

      const jsonResult = await result.json();
      if (jsonResult.response && jsonResult.data) {
        toast.success(jsonResult.response);
        setLikeColor("red");
        setLikeId(jsonResult.data.favourite_id);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function removeLike(e) {
    try {
      const result = await fetch(`${url}/favourites/${e.target.id}`, {
        method: "DELETE",
      });

      const jsonResult = await result.json();
      if (jsonResult.response) {
        setLikeColor("grey");
        setLikeId(null);
        toast.success(jsonResult.response);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // const [quantity, setQuantity] = useState(props.quantity);

  return (
    <div className="container">
      <div className="item div row hstack">
        <div className="col-lg-3 col-md-12 col-sm-12 my-2">
          <img src={props.image} alt="img" />
        </div>

        <div className="vstack col-lg-3 col-md-12 col-sm-12">
          <h3 id={props.product_id}>
            <a href={"/shopping/" + props.product_id}>{props.title}</a>
            {!admin && !props.cart && (
              <i
                style={{ color: `${likeColor}` }}
                onClick={likeId === null ? like : removeLike}
                id={likeId}
                className="fa-solid fa-heart"
              ></i>
            )}
          </h3>
          <p>
            <strong>Description: </strong> {props.description}
          </p>
          <p>
            <strong>Price: </strong>
            <span className="price">&#36;{props.price}</span>/-
          </p>
          <p>
            <strong>Rating: </strong> {props.rating}
            <i className="fa-solid fa-star" style={{ marginLeft: "1%" }}></i>
          </p>

          {admin && (
            <div style={{ padding: "2%" }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteProduct(props.product_id, props.title)}
              >
                Delete
              </button>
              <button
                className="btn btn-info ms-4"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#updateBtn"
                onClick={editProductInfo}
              >
                Update
              </button>
            </div>
          )}
          {props.cart && (
            <div>
              <div className="hstack">
                <p>
                  <strong>Quantity: </strong> {props.quantity}
                </p>
                {/* <button onClick={() => quantity > 1 &&  setQuantity(quantity - 1)}
                  className="btn btn-outline-info mb-3 ms-5"> - </button>
              <input type="text" className="form-control mb-3 ms-3" disabled
                    value={quantity} style={{width: "10%"}}/>
              <button className="btn btn-outline-danger mb-3 ms-3" 
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                > + </button> */}
              </div>
              <button
                onClick={removeFromCart}
                type="button"
                className="btn btn-danger"
              >
                Remove from cart
              </button>
            </div>
          )}

          {/* {props.cart &&
          <button type="button" className="btn btn-warning"
            onClick={buy}
            data-bs-toggle="modal" data-bs-target="#buyBtn">
            Buy Now
          </button>
          // :
          // <button type="button" className="btn btn-warning"
          //   onClick={addToCart}>
          //     {props.btn}
          // </button>
        } */}
        </div>
      </div>

      <div
        className="modal fade"
        id="updateBtn"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 navStyle" id="exampleModalLabel">
                Update Product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={editProduct} method="post">
                <input
                  type="hidden"
                  id="pro_id"
                  name="pro_id"
                  value={props.product_id}
                />
                <div className="hstack">
                  <p>
                    <strong>Name: </strong>
                  </p>
                  <input
                    type="text"
                    name="name"
                    id="editName"
                    placeholder="Product Name"
                    autoComplete="off"
                    className="form-control mb-3 ms-2"
                  />
                </div>
                <div className="hstack">
                  <p>
                    <strong>Descrption: </strong>
                  </p>
                  <textarea
                    type="text"
                    name="description"
                    id="editDescription"
                    placeholder="Product descrption"
                    className="form-control ms-2 mb-3"
                  />
                </div>
                <div className="hstack">
                  <p>
                    <strong>Price: </strong>
                  </p>
                  <input
                    type="number"
                    name="price"
                    id="editPrice"
                    placeholder="Price"
                    className="form-control mb-3 ms-2"
                  />
                </div>
                <div className="hstack">
                  <p>
                    <strong>Image: </strong>
                  </p>
                  <input
                    type="text"
                    name="image"
                    id="editImage"
                    placeholder="Product Image(url)"
                    className="form-control mb-3 ms-2"
                  />
                </div>
                <button
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-success"
                >
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Item;
