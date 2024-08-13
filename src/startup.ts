import { absolute, graphics, label, spinner, store, twoway, window } from "openrct2-flexui";
import service from "./service";

const _service = new service();

const size_nw_se = (): number =>
  (ui.mainViewport.rotation % 2 == 0 ? map.size.y : map.size.x) - 2;

const size_ne_sw = (): number =>
  (ui.mainViewport.rotation % 2 == 0 ? map.size.x : map.size.y) - 2;

let sizeNESW = store<number>(size_ne_sw());
let sizeNWSE = store<number>(size_nw_se());

// Store previous value of each spinner for bounds checking.
let spinnerNE: number;
let spinnerNW: number;
let spinnerSE: number;
let spinnerSW: number;

let timeoutHandle: number = -1;
let mapRotation: number = ui.mainViewport.rotation;

const setSpinnerValues = function (): void {
  sizeNESW.set(size_ne_sw());
  sizeNWSE.set(size_nw_se());

  spinnerNE = size_ne_sw();
  spinnerSW = size_ne_sw();
  spinnerNW = size_nw_se();
  spinnerSE = size_nw_se();
}

const resizerWindow = window({
  title: "Resize map",
  width: { value: 300 },
  height: { value: 212 },
  content: [
    absolute([
      graphics({
        onDraw: (g: GraphicsContext) => {
          // Draw the big diamond
          g.line(144, 6, 6, 75);
          g.line(6, 75, 144, 144);
          g.line(144, 144, 282, 75);
          g.line(282, 75, 144, 6);

          // Draw arrow NW
          g.line(87, 48, 61, 35);
          g.line(61, 35, 65, 39);
          g.line(61, 35, 67, 35);
          g.line(87, 48, 83, 44);
          g.line(87, 48, 81, 48);

          // Draw arrow NE
          g.line(199, 48, 225, 35);
          g.line(225, 35, 219, 35);
          g.line(225, 35, 221, 39);
          g.line(199, 48, 205, 48);
          g.line(199, 48, 203, 44);

          // Draw arrow SW
          g.line(87, 103, 61, 116);
          g.line(61, 116, 67, 116);
          g.line(61, 116, 65, 112);
          g.line(87, 103, 80, 103);
          g.line(87, 103, 83, 107);

          // Draw arrow SE
          g.line(199, 103, 225, 116);
          g.line(225, 116, 218, 116);
          g.line(225, 116, 221, 112);
          g.line(199, 103, 206, 103);
          g.line(199, 103, 203, 107);
        },
        x: 0,
        y: 0,
        width: "100%",
        height: "100%"
      }),
      spinner({ // NW
        minimum: 3,
        maximum: 999,
        value: twoway(sizeNWSE),
        onChange: (value: number, adjustment: number) => {
          if (value !== spinnerNW) {
            _service.adjust(0, value, adjustment);
            spinnerNW = value;
          }
        },
        x: 6,
        y: 6,
        width: 60,
        height: 15
      }),
      spinner({ // NE
        minimum: 3,
        maximum: 999,
        value: twoway(sizeNESW),
        onChange: (value: number, adjustment: number) => {
          if (value !== spinnerNE) {
            _service.adjust(1, value, adjustment);
            spinnerNE = value;
          }
        },
        x: 228,
        y: 6,
        width: 60,
        height: 15
      }),
      spinner({ // SE
        minimum: 3,
        maximum: 999,
        value: twoway(sizeNWSE),
        onChange: (value: number, adjustment: number) => {
          if (value !== spinnerSE) {
            _service.adjust(2, value, adjustment);
            spinnerSE = value;
          }
        },
        x: 228,
        y: 130,
        width: 60,
        height: 15
      }),
      spinner({ // SW
        minimum: 3,
        maximum: 999,
        value: twoway(sizeNESW),
        onChange: (value: number, adjustment: number) => {
          if (value !== spinnerSW) {
            _service.adjust(3, value, adjustment);
            spinnerSW = value;
          }
        },
        x: 6,
        y: 130,
        width: 60,
        height: 15
      }),
      label({
        text: "WARNING! Changes are irreversible and\ncan be destructive. Use at your own risk,\nand make save file backups.",
        alignment: "left",
        x: 6,
        y: 152,
        height: 42,
        width: 288
      })
    ])
  ],
  onClose: () => context.clearInterval(timeoutHandle)
});

export function startup() {
  if (typeof ui !== "undefined") {
    ui.registerMenuItem("Resize map", () => {
      setSpinnerValues();
      resizerWindow.open();

      // I don't think we can subscribe to the
      // viewport being rotated, so this is
      // the best I can do for now
      timeoutHandle = context.setInterval(() => {
        if (mapRotation != ui.mainViewport.rotation) {
          mapRotation = ui.mainViewport.rotation;
          setSpinnerValues();
        }
      }, 100);
    });
  }
}
