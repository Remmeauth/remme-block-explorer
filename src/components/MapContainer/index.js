import React, { Component } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps";
import geoData from "../../assets/world.json";
import ReactTooltip from "react-tooltip";

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
};

const markers = [
  {
    name: "HK, China",
    coordinates: [114.173351, 22.304807],
  }
];

class SimpleMarkers extends Component {
  handleClick(marker, evt) {
    console.log("Marker data: ", marker);
  }

  render() {
    return (
      <div>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [0, 0, 0]
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto"
          }}
        >
          <ZoomableGroup disablePanning center={[0,20]}>
            <Geographies geography={geoData}>
              {(geographies, projection) =>
                geographies.map((geography, i) => (
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: "f3f3f3",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      hover: {
                        fill: "#CFD8DC",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      pressed: {
                        fill: "#FF5722",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
            <Markers>
              {markers.map((marker, i) => (
                <Marker
                  key={i}
                  marker={marker}
                  //data-tip={"ciao"}
                  //data-for='test'
                  //onClick={this.handleClick}
                  style={{
                    default: { fill: "#00AAFF" },
                    hover: { fill: "#FFFFFF" },
                    pressed: { fill: "#00AAFF" }
                  }}
                >
                  <circle
                    data-tip={marker.name}
                    data-event="click"
                    cx={0}
                    cy={0}
                    r={5}
                    style={{
                      fill:"#FF5722",
                      stroke:"#DF3702"
                    }}
                  />
                </Marker>
              ))}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip globalEventOff="click" />
      </div>
    );
  }
}

export default SimpleMarkers;
