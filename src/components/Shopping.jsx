import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Item from "./Item";

function Shopping(props) {
  const url = props.url;

  const [items, setItems] = useState([]);

  const userId = JSON.parse(localStorage.getItem("userData")).user_id;

  async function getData() {
    try {
      const result = await fetch(`${url}/products?user_id=${userId}`, {
        method: "GET",
      });

      const jsonResult = await result.json();
      setItems(jsonResult?.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!localStorage.userData) {
      window.location.href = "/";
      return;
    }
    getData();
  }, []);

  function unHide() {
    const shoppingItems = document.getElementById("shoppingItems").childNodes;
    shoppingItems.forEach((item) => {
      item.hidden = false;
    });
  }

  function search() {
    const searchValue = document.getElementById("searchBox").value;
    document.getElementById("priceLess").value = "";
    unHide();
    const shoppingItems = document.getElementById("shoppingItems").childNodes;

    shoppingItems.forEach((item) => {
      if (!item.innerText) {
        return;
      }
      if (!item.innerText.toLowerCase().includes(searchValue.toLowerCase())) {
        item.hidden = true;
      }
    });
  }

  function searchFilter() {
    unHide();
    let priceFilter = document.getElementById("priceLess").value;
    document.getElementById("searchBox").value = "";

    const prices = document.getElementsByClassName("price");
    for (var i = 0; i < prices.length; i++) {
      var price = parseInt(prices[i].innerText.slice(1));
      if (price >= priceFilter) {
        prices[
          i
        ].parentElement.parentElement.parentElement.parentElement.hidden = true;
      }
    }
  }

  return (
    <div>
      <Navbar onAdd={getData} url={url} />

      <div>
        <div className="hstack">
          <input
            style={{
              margin: "30px",
              padding: "8px",
              width: "45%",
              marginRight: "10px",
            }}
            type="search"
            name="search"
            autoComplete="off"
            id="searchBox"
            onChange={search}
            placeholder="Search"
            className="form-control ms-5"
          />

          <button
            type="button"
            className="btn btn-outline-success"
            data-bs-toggle="modal"
            data-bs-target="#filter"
          >
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>
        <div id="shoppingItems">
          {items.map((item) => {
            return (
              <Item
                key={item.product_id}
                product_id={item.product_id}
                title={item.name}
                image={item.image}
                description={item.description}
                price={item.price}
                rating={item.average_rating}
                like={item.favourite_id}
                btn="Add to Cart"
                url={url}
                onChange={getData}
              />
            );
          })}
        </div>
      </div>

      <div
        className="modal fade"
        id="filter"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ padding: "15px" }}>
            <div className="modal-header">
              <h1 className="modal-title navStyle fs-5" id="exampleModalLabel">
                Filters
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="number"
                name="price"
                placeholder="Price Less Then or Equal"
                id="priceLess"
                autoComplete="off"
                className="form-control mb-3"
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={searchFilter}
                data-bs-dismiss="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shopping;
