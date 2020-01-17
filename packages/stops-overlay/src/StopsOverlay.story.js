import BaseMap from "@opentripplanner/base-map";
import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import StopsOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.523092, -122.671202];
const languageConfig = { stopViewer: "View Stop" };

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

let randomStopCode = 1;

function makeRandomStop({ minLat, minLon, maxLat, maxLon }) {
  randomStopCode++;
  return {
    agencyName: "Fake agency",
    code: `${randomStopCode}`,
    desc: `A random stop (Stop ID ${randomStopCode})`,
    id: `FakeAgency:${randomStopCode}`,
    lat: randomRange(minLat, maxLat),
    lon: randomRange(minLon, maxLon),
    mode: "BUS",
    name: `Stop ${randomStopCode}`,
    type: 3,
    url: `http://example.com/stop/${randomStopCode}`
  };
}

class Example extends Component {
  constructor() {
    super();
    this.state = {
      stops: []
    };
  }

  refreshStops = bounds => {
    const stops = Array(10)
      .fill(null)
      .map(() => makeRandomStop(bounds));
    this.setState({ stops });
  };

  render() {
    const { stopMarkerPath, stopMarkerRadius } = this.props;
    const { stops } = this.state;
    return (
      <BaseMap center={center}>
        <StopsOverlay
          languageConfig={languageConfig}
          name="Transit Stops"
          refreshStops={this.refreshStops}
          setLocation={action("setLocation")}
          setViewedStop={action("setViewedStop")}
          stopMarkerPath={stopMarkerPath}
          stopMarkerRadius={stopMarkerRadius}
          stops={stops}
          visible
        />
      </BaseMap>
    );
  }
}

Example.propTypes = {
  stopMarkerPath: leafletPathType,
  stopMarkerRadius: PropTypes.number
};

Example.defaultProps = {
  stopMarkerPath: undefined,
  stopMarkerRadius: undefined
};

const stopMarkerPath = {
  color: "purple",
  fillColor: "#00ff11",
  fillOpacity: 1,
  weight: 3
};

storiesOf("StopsOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("StopsOverlay", () => <Example />)
  .add("StopsOverlay with custom marker styling", () => (
    <Example stopMarkerPath={stopMarkerPath} stopMarkerRadius={10} />
  ));
