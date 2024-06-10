import React, { useEffect, useState } from "react";
import styles from "./Style/Home.module.css";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useToast } from "../Context/ToastContext";
import GoogleMapReact from "google-map-react";
import ProductDetails from "../Components/ProductDetails";

const Home = () => {
  const { cart, setCart, fetchCartItemCount } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [locations, setLocations] = useState([]);
  const [GmapKey, setGmapKey] = useState("");
  const { showSuccessToast, showErrorToast } = useToast();
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [isMerchantOrAdmin, setIsMerchantOrAdmin] = useState(false);
  const [modelDetails, setModelDetails] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(storedToken);
      setUserId(decodedToken?.id);
      setIsMerchantOrAdmin(decodedToken?.isAdmin || decodedToken?.isMerchant);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/prod/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/mapper`
        );
        setGmapKey(response.data);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const locations = products
      .map((item, index) => {
        const lat = item?.latlng?.[0];
        const lng = item?.latlng?.[1];
        return {
          id: index + 1,
          lat: lat,
          lng: lng,
          product: item, // Include product information in location object
        };
      })
      .filter(
        (location) => location.lat !== undefined && location.lng !== undefined
      );

    setLocations(locations);
  }, [products]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add-to-cart`,
        {
          userId,
          productId,
        }
      );

      setCart([...cart, productId]);
      fetchCartItemCount();
      showSuccessToast("Rack Added to Cart");
    } catch (error) {
      showErrorToast("Error Adding Rack");
      console.error("Error adding product to cart:", error);
    }
  };

  const renderMarkers = (map, maps) => {
    locations?.forEach((location) => {
      const product = location.product;
      if (product.availability) {
        const defaultIcon = {
          url: "./marker.png", // Assuming product.image contains the URL of the marker image
          scaledSize: new maps.Size(25, 25),
        };

        const hoveredIcon = {
          url: "./marker.png",
          scaledSize: new maps.Size(40, 40), // Increased size on hover
        };

        const marker = new maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: product.productName,
          icon: defaultIcon,
        });

        const contentString = product
          ? `
      <div class="max-w-xs bg-white rounded-lg shadow-md overflow-hidden">
      <div class="relative">
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover object-center" />
      </div>
      <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">${product.productName}</h3>
      <p class="text-gray-600 mb-2">Price: ₹${product.price}</p>
      <p class="text-gray-600 mb-2">Days: ${product.days}</p>
      <p class="text-gray-600 mb-2">Location: ${product.city}, ${product.state}</p>
      </div>
      </div>
      `
          : "";

        const infowindow = new maps.InfoWindow({
          content: contentString,
        });

        marker.addListener("click", () => {
          // Close any open info window
          if (openInfoWindow) {
            openInfoWindow.close();
          }

          // Open the clicked marker's info window
          infowindow.open(map, marker);
          setOpenInfoWindow(infowindow);
        });

        marker.addListener("mouseover", () => {
          marker.setIcon(hoveredIcon); // Increase size on hover
        });

        marker.addListener("mouseout", () => {
          marker.setIcon(defaultIcon); // Restore default size on mouseout
        });
      }
    });

    // Close info window when clicking on the map
    map.addListener("click", () => {
      if (openInfoWindow) {
        openInfoWindow.close();
        setOpenInfoWindow(null);
      }
    });

    // Close info window when clicking outside of it
    window.addEventListener("click", (e) => {
      if (
        openInfoWindow &&
        openInfoWindow.getContent &&
        !openInfoWindow.getContent().contains(e.target)
      ) {
        openInfoWindow.close();
        setOpenInfoWindow(null);
      }
    });
  };

  if (modelDetails)
    return (
      <div>
        <ProductDetails
          product={modelDetails}
          setModelDetails={setModelDetails}
          handleAddToCart={handleAddToCart}
        />
      </div>
    );

  return (
    <>
      <div className={styles.home_container}>
        {products
          .filter((product) => product.availability)
          .map((product) => (
            <div className={styles.card} key={product._id}>
              {product.image && product.image.startsWith("https://") ? (
                <img src={product.image} alt={product.productName} />
              ) : (
                <img
                  src={`${API_URL}/${product.image.replace(/\\/g, "/")}`}
                  alt={product.productName}
                />
              )}
              <div className={styles.card_details}>
                <h3>{product.productName}</h3>
                <p>Price: ₹{product.price}</p>
                <p>Days: {product.days}</p>
                <p>
                  Location: {product.city}, {product.state} <br />{" "}
                  {product.pincode}
                </p>
                <div className="flex justify-center gap-3 items-center py-2">
                  {!isMerchantOrAdmin && (
                    <>
                      <button
                        className={styles.details__Button}
                        onClick={() => setModelDetails(product)}
                      >
                        Details
                      </button>
                      <button onClick={() => handleAddToCart(product._id)}>
                        Purchase Rack
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {GmapKey && (
        <div style={{ height: "100vh", width: "75%", margin: "200px auto" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GmapKey.toString(),
            }}
            yesIWantToUseGoogleMapApiInternals
            options={(maps) => {
              return {
                mapTypeControl: true,
                mapTypeControlOptions: {
                  style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: maps.ControlPosition.BOTTOM_CENTER,
                  mapTypeIds: [
                    maps.MapTypeId.ROADMAP,
                    maps.MapTypeId.SATELLITE,
                    maps.MapTypeId.HYBRID,
                  ],
                },
                zoomControl: true,
                clickableIcons: false,
              };
            }}
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            defaultZoom={4.5}
            onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
          />
        </div>
      )}
    </>
  );
};

export default Home;
