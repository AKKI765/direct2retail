import React, { useEffect, useState } from "react";
import styles from "./ItemCreate.module.css";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";
import GoogleMapReact from "google-map-react";

const ItemCreate = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSuccessToast, showErrorToast } = useToast();
  const [uid, setUid] = useState(null);

  const [GmapKey, setGmapKey] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageType, setImageType] = useState("");

  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  const defaultProps = {
    center: {
      lat: 20.5937,
      lng: 78.9629,
    },
    zoom: 4,
  };

  const [item, setItem] = useState({
    productName: "",
    days: "",
    price: "",
    image: "",
    state: "",
    pincode: "",
    details: "",
    lati: "",
    longi: "",
    city: "",
  });
  const [mapKey, setMapKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isMerchant) {
        navigate("/login");
      } else {
        setUid(decodedToken.id);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/mapper`);
        setGmapKey(response.data);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = item.image;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await axios.post(
          `${API_URL}/api/prod/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = response.data.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        showErrorToast("Error uploading image");
        return;
      }
    }

    const productData = { ...item, userId: uid, image: imageUrl };
    try {
      const response = await axios.post(
        `${API_URL}/api/prod/products`,
        productData
      );
      if (response) {
        // Reset form fields
        setItem({
          productName: "",
          days: "",
          price: "",
          image: "",
          state: "",
          pincode: "",
          details: "",
          lati: "",
          longi: "",
          city: "",
        });
        setSelectedLocation(null);
        setSelectedFile(null);
        setCenter(defaultProps?.center);
        setZoom(defaultProps?.zoom);
      }
      showSuccessToast("Rack Added Successfully");
    } catch (error) {
      showErrorToast("Error Try Again");
      console.error("Error creating item:", error);
    }
  };

  useEffect(() => {
    const fetchLatlongByPincode = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${item?.pincode}&key=${GmapKey}`
        );
        const { lat, lng } = response.data.results[0]?.geometry?.location;
        setCenter({ ...center, lat, lng });
        setZoom(18);
        setSelectedLocation({ lat, lng });
        setItem({ ...item, lati: lat, longi: lng });
      } catch (error) {
        console.error("Error fetching lat long:", error);
      }
    };
    if (item?.pincode?.length === 6) {
      fetchLatlongByPincode();
    }
    // eslint-disable-next-line
  }, [item.pincode, GmapKey]);

  const handleMapClick = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
    setCenter({ lat, lng });
    setZoom(18);
    setItem({ ...item, lati: lat, longi: lng });
  };

  const renderMarkers = (map, maps) => {
    if (selectedLocation) {
      let marker = new maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        title: "",
      });
      return marker;
    }
  };

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [selectedLocation]);

  const clearImage = () => {
    setItem({ ...item, image: "" });
    setSelectedFile(null);
  };

  const handleImageChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (value.trim().length > 0 || value === "") {
        setItem({ ...item, image: value });
        setImageType("url");
        setSelectedFile(null);
      } else {
        setImageType("file");
        if (files && files.length > 0) {
          setSelectedFile(files[0]);
        }
      }
    } else {
      setImageType("file");
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setItem({ ...item, image: "" });
      }
    }
  };

  return (
    <div className={styles.form_container_create}>
      <h2>Create a New Rack</h2>
      <form className={styles.item_form} onSubmit={handleSubmit}>
        <label htmlFor="image" className={styles.label}>
          Image URL or Upload
        </label>
        <div className={styles.form_group}>
          <input
            type="text"
            id="image"
            name="image"
            value={item.image}
            onChange={handleImageChange}
            className={styles.input}
            placeholder="Enter Image URL"
          />

          <div className="flex flex-col">
            <label htmlFor="imageUpload" className={styles.file_upload_label}>
              <span>Upload Image</span>
              <input
                type="file"
                id="imageUpload"
                name="file"
                onChange={handleImageChange}
                className={styles.file_upload_input}
                accept="image/*"
              />
            </label>

            <div className={styles.image_preview_container}>
              {imageType === "url" && item.image && (
                <img
                  src={item.image}
                  alt="Preview"
                  className={styles.image_preview}
                />
              )}
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className={styles.image_preview}
                />
              )}
              {item.image && !selectedFile && imageType !== "url" && (
                <img
                  src={item.image}
                  alt="Preview"
                  className={styles.image_preview}
                />
              )}
            </div>

            {(item.image || selectedFile) && (
              <button
                type="button"
                onClick={clearImage}
                className={`${styles.clear_button} whitespace-nowrap`}
              >
                Clear Image
              </button>
            )}
          </div>
        </div>

        <div className={styles.form_group}>
          <label htmlFor="productName" className={styles.label}>
            Rack Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={item.productName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="days" className={styles.label}>
            Days
          </label>
          <input
            type="text"
            id="days"
            name="days"
            value={item.days}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price" className={styles.label}>
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={item.price}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state" className={styles.label}>
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={item.state}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={item.city}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pincode" className={styles.label}>
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={item.pincode}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className="form-group mt-4">
          <label htmlFor="details" className={styles.label}>
            Rack Details
          </label>

          <div class="relative w-full min-w-[200px]">
            <textarea
              className={styles.input}
              placeholder=""
              name="details"
              value={item.details}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        {GmapKey && (
          <div
            className="form-group py-6"
            style={{ width: "100%", height: "400px" }}
          >
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <GoogleMapReact
              key={mapKey} // Set key to force re-render
              onClick={handleMapClick}
              bootstrapURLKeys={{ key: GmapKey.toString() }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              center={center}
              zoom={zoom}
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
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
            />
          </div>
        )}

        <div className="pt-4">
          <button type="submit" className={styles.button}>
            Create Rack
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemCreate;
