import React, {useState, useEffect} from "react";
import Navbar from "./Navbar";
import Item from "./Item";

function Favourites(props) {

  const url = props.url;
  const userId = JSON.parse(localStorage.getItem("userData")).user_id;

  const [favItems, setFavItems] = useState([]);

  async function getData() {
    try {
      const result = await fetch(`${url}/favourites/${userId}`, {
        method: "GET"
      });
  
      const jsonResult = await result.json();
      if (jsonResult.data) {
        setFavItems(jsonResult.data);
      }
      // toast.success(jsonResult?.message);
  
    } catch (e) {
      console.log(e);
    } 
  }

  useEffect(() => {
    getData();
  }, []);

 return(
   <div>
    <Navbar url={url}/>
    {favItems.length ?
        favItems.map((item) => {
          return(
            <Item
            key={item.product_id}
            product_id={item.product_id}
            title={item.name}
            image={item.image}
            description={item.description}
            price={item.price}
            rating={item.rating}
            like={item.favourite_id}
            btn='Add to Cart'
            cart={false}
            url={url}
            />
          );
        })
    :
    <h1 className="heading">Your Favourites are empty. Continue <a href="/shopping">Shopping</a> </h1>
    }

   </div>
 );
}

export default Favourites;
