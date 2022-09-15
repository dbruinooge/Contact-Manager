"use strict";

import Model from "./model.js";
import View from "./view.js";
import Controller from "./controller.js";

(() => {
  return new Controller(new Model(), new View());
})();