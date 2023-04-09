import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Item from "./Item";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart(props) {
  const url = props.url;
  const [cartItems, setCartItems] = useState(
    (localStorage?.cart && JSON.parse(localStorage?.cart)) || []
  );
  const [userData, setUserData] = useState();
  let totalPrice = 0;

  function getData() {
    if (localStorage.cart) {
      setCartItems(JSON.parse(localStorage.cart));
      JSON.parse(localStorage.cart).forEach((item) => {
        totalPrice += item.price * item.quantity;
      });

      const price = document.getElementById("price");

      if (price) {
        price.innerHTML = `<strong>Total price: </strong> &#36;${totalPrice}`;
      }
    }
    if (localStorage.userData) {
      setUserData(JSON.parse(localStorage.userData));
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function getCardInfo(evt) {
    const cn = document.getElementById("cardNumber");
    const cvv = document.getElementById("cvv");
    const date = document.getElementById("date");

    try {
      const result = await fetch(`${url}/card/${userData.user_id}`, {
        method: "GET",
      });

      const jsonResult = await result.json();
      if (!Object.keys(jsonResult?.data).length) {
        cn.value = "";
        cvv.value = "";
        date.value = "";
        return;
      }

      cn.value = jsonResult.data.card_number;
      date.value = jsonResult.data.expiry_date;
    } catch (e) {
      console.log(e);
    }
  }

  async function checkOut(evt) {
    evt.preventDefault();
    const { cardNumber, cvv, date } = evt.target;
    const postBody = {
      card_number: cardNumber.value,
      cvv: cvv.value,
      expiry_date: date.value,
    };

    try {
      const result = await fetch(`${url}/card/${userData.user_id}`, {
        method: "POST",
        body: JSON.stringify(postBody),
      });

      const jsonResult = await result.json();
      toast.success(jsonResult?.response);

      cardNumber.value = "";
      cvv.value = "";
      date.value = "";
      document.getElementById("checkOutClose").click();
      localStorage.setItem("cart", "[]");
      getData();
      document.getElementById("cartLength").innerText = 0;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar url={url} />
      {cartItems.length !== 0 && (
        <div id="checkOutInfo" className="div item container">
          <p id="price"></p>
          <button
            type="button"
            className="btn btn-success"
            onClick={getCardInfo}
            data-bs-toggle="modal"
            data-bs-target="#checkOutBtn"
          >
            Check Out
          </button>
        </div>
      )}
      {cartItems.length !== 0 ? (
        cartItems.map((item) => {
          return (
            <Item
              key={item.product_id}
              product_id={item.product_id}
              title={item.name}
              image={item.image}
              description={item.description}
              price={item.price}
              rating={item.rating}
              btn="Buy Now"
              cart={true}
              quantity={item.quantity}
              onDelete={getData}
            />
          );
        })
      ) : (
        <h1 className="heading">
          Your Cart is empty. Continue <a href="/shopping">Shopping</a>{" "}
        </h1>
      )}

      <div
        className="modal fade"
        id="checkOutBtn"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 " id="exampleModalLabel">
                Payment
              </h1>
              <button
                type="button"
                className="btn-close"
                id="checkOutClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={checkOut}>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  required
                  className="form-control mb-3"
                  placeholder="Card Number"
                />
                <div className="hstack">
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    required
                    placeholder="CVV"
                    maxLength="3"
                    minLength="3"
                    style={{ width: "15%" }}
                    className="form-control mb-3"
                  />
                  <div className="input-group ms-3">
                    <span
                      style={{ height: "38px" }}
                      className="input-group-text"
                      id="basic-addon1"
                    >
                      Expire Date:
                    </span>
                    <input
                      type="date"
                      required
                      id="date"
                      name="date"
                      className="form-control mb-3"
                      style={{ width: "30%" }}
                      placeholder="Expire date"
                    />
                  </div>
                </div>
                <button type="submit" name="button" className="btn btn-success">
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

export default Cart;
