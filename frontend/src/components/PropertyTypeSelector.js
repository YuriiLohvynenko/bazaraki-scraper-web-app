import React from "react";

export default function PropertyTypeSelector({current = "", changeHandler = () => {}}) {
    return (
        <select id="sel-type" onChange={changeHandler}>
            <option value="" selected={current === ""}>Any type</option>
            <option value="Apartment" selected={current === "Apartment"}>Apartment</option>
            <option value="Detached house" selected={current === "Detached house"}>Detached house</option>
            <option value="Semi-detached" selected={current === "Semi-detached"}>Semi-detached</option>
            <option value="Ground floor apartment" selected={current === "Ground floor apartment"}>Ground floor apartment</option>
            <option value="Maisonette" selected={current === "Maisonette"}>Maisonette</option>
            <option value="Town house" selected={current === "Town house"}>Town house</option>
            <option value="Penthouse" selected={current === "Penthouse"}>Penthouse</option>
            <option value="Bungalow" selected={current === "Bungalow"}>Bungalow</option>
            <option value="Villa" selected={current === "Villa"}>Villa</option>
            <option value="House Share" selected={current === "House Share"}>House Share</option>
        </select>
    )
}