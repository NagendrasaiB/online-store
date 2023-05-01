import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

import Navbar from "./Navbar";

function Product(props) {
  const url = props.url;
  const userId = JSON.parse(localStorage.getItem("userData"))?.user_id;
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState([]);
  const productId = useParams().productId;

  async function getData() {
    try {
      const result = await fetch(`${url}/products/${productId}`, {
        method: "GET",
      });

      const jsonResult = await result.json();
      console.log(jsonResult);
      if (jsonResult?.data) {
        setProduct(jsonResult.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getReviews() {
    try {
      const result = await fetch(`${url}/review/${productId}`, {
        method: "GET",
      });
      console.log(result);

      const jsonResult = await result.json();
      if (jsonResult?.data) {
        setReviews(jsonResult.data);

        return jsonResult.data
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
    getReviews();
  }, []);

  function addToCart() {
    let arr = [];
    let addCartInfo = {
      name: product.name,
      product_id: product.product_id,
      description: product.description,
      image: product.image,
      rating: product.average_rating,
      price: product.price,
      favourite_id: product.favourite_id,
      quantity: quantity,
    };
    if (!localStorage.cart) {
      arr.push(addCartInfo);

      localStorage.setItem("cart", JSON.stringify(arr));
      toast.success("Added to cart");

      let a = document.getElementById("cartLength");
      a.innerText = Number(a.innerText) + 1;

      return;
    }

    if (localStorage.cart) {
      let cartItems = JSON.parse(localStorage.cart);
      if (
        cartItems.some((cartItem) => cartItem.product_id === product.product_id)
      ) {
        toast.info("Already in cart");

        return;
      }
      cartItems.push(addCartInfo);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      toast.success("Added to cart");

      let a = document.getElementById("cartLength");
      a.innerText = Number(a.innerText) + 1;
      return;
    }
  }

  async function addReview(evt) {
    evt.preventDefault();
    const { review, rating } = evt.target;
    const reviewBody = {
      user_id: userId,
      product_id: productId,
      comment: review.value,
      rating: rating.value,
    };
    try {
      const result = await fetch(`${url}/review`, {
        method: "POST",
        body: JSON.stringify(reviewBody),
      });

      const jsonResult = await result.json();
      console.log(jsonResult);
      if (jsonResult?.response) {
        toast.success(jsonResult.response);
        getData();

        getReviews();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const [quantity, setQuantity] = useState(1);

  // REPORT GENERATION
  function generateExcelReport(data, sheetName, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelData], { type: 'application/octet-stream' });

    const dataUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.xlsx`;
    
    link.click();
  }

  function filterReviewsByDate(reviews, startDate, endDate) {
    const filteredReviews = reviews.filter((review) => {
      const timestamp = new Date(review.timestamp);
      startDate = new Date(startDate);
      endDate = new Date(endDate);

      return timestamp >= startDate && timestamp <= endDate;
    });

    return filteredReviews;
  }

  const downloadReviewsReport = async (event) => {
    event.preventDefault();
    const startDate = document.getElementById('startDate')
    const endDate = document.getElementById('endDate')

    if (startDate.value && endDate.value) {
      const reviews = await getReviews();
      const filteredReviews = filterReviewsByDate(reviews, startDate.value, endDate.value);

      generateExcelReport(filteredReviews, 'User Product Reviews', 'reviews_report')
    } else {
      toast.error("Select Start and End Date!");
    }
  }

  return (
    <div>
      <Navbar url={url} />
      {product ? (
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-lg-5 col-md-5 col-sm-12">
              <img className="productImg" alt="img" src={product.image} />
            </div>

            <div
              className="col-lg-5 col-md-5 col-sm-12 div vstack"
              style={{ marginTop: "20px", padding: "30px" }}
            >
              <h2 className="navStyle">{product.name}</h2>
              <p>
                <strong>Description: </strong> {product.description}
              </p>
              <p>
                <strong>Price: </strong> &#36;{product.price}
              </p>
              <p>
                <strong>Rating: </strong> {product.average_rating}
                <i
                  className="fa-solid fa-star"
                  style={{ marginLeft: "1%" }}
                ></i>
              </p>
              <div className="hstack">
                <p>
                  <strong>Quantity: </strong>
                </p>
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="btn btn-outline-info mb-3 ms-5"
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control mb-3 ms-3"
                  disabled
                  value={quantity}
                  style={{ width: "10%" }}
                  placeholder="Quantity"
                />
                <button
                  className="btn btn-outline-danger mb-3 ms-3"
                  onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div>
                <button
                  className="btn btn-warning"
                  onClick={addToCart}
                  type="button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {reviews.length !== 0 ? (
            <div
              className="reviewsDiv div"
              style={{ padding: "20px", marginBottom: "30px" }}
            >
              <div class="header">
                <form>
                  <h1 class="navStyle">Reviews Report</h1>

                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="startDate">Start Date</label>
                      <input type="datetime-local" class="form-control" id="startDate" placeholder="Start Date" />
                    </div>
                    <div class="form-group col-md-6 mt-3">
                      <label for="endDate">End Date</label>
                      <input type="datetime-local" class="form-control" id="endDate" placeholder="End Date" />
                    </div>
                  </div>
                  <button class="reviewsButton btn btn-primary mt-3 mb-4" onClick={downloadReviewsReport} type="submit">
                    Reviews <i class="fas fa-download"></i>
                  </button>
                </form>
              </div>

              <h1 class="navStyle">Reviews</h1>
              {reviews.map((review, idx) => {
                return (
                  <div key={idx} className="reviewsDiv">
                    <p>
                      <strong>{review.name}</strong>
                      <span>
                        {review.rating} <i className="fa-solid fa-star"></i>
                      </span>
                    </p>
                    <p>{review.review}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <h1 className="heading navStyle div" style={{ padding: "20px" }}>
              No reviews yet!
            </h1>
          )}
          {userId && (
            <div className="reviewForm mb-5">
              <form onSubmit={(evt) => addReview(evt)} method="post">
                <input
                  type="text"
                  className="form-control mb-3"
                  name="review"
                  placeholder="Add a review"
                />
                <div className="hstack">
                  <p>
                    <strong>Rating:</strong>
                  </p>
                  <input
                    type="number"
                    max="10"
                    min="1"
                    style={{ width: "15%" }}
                    className="form-control ms-3 mb-3"
                    name="rating"
                  />
                  <p> /10</p>
                </div>
                <button type="submit" className="btn btn-success" name="button">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <h1 className="heading">
          Invalid product. Continue <a href="/shopping">Shopping</a>
        </h1>
      )}

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

export default Product;
